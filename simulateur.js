/**
 *  @author     Kimba SABI N'GOYE
 *  @version    1
 *  @created on:        03/05/2020
 *  @last modified:     03/05/2020 23:30
 *  @link       https://github.com/sabingoyek7/simulateur-calcul-salaire-net
 */

var tauxVPS = 2;
var tauxRegimePension = 6;
var tauxAssuranceEmploye = 2;
var tauxReductionIPTS = [
    {
        nombreEnfants: 1,
        taux: 0
    },
    {
        nombreEnfants: 2,
        taux: 5
    },
    {
        nombreEnfants: 3,
        taux: 10
    },
    {
        nombreEnfants: 4,
        taux: 15
    },
    {
        nombreEnfants: 5,
        taux: 20
    },
    {
        nombreEnfants: 6, // 6 et plus
        taux: 23
    }
];

var baremeIPTS = [
    {
        taux: 0,
        salaire_min: 0,
        salaire_max: 50000
    },
    {
        taux: 10,
        salaire_min: 50001,
        salaire_max: 130000
    },
    {
        taux: 15,
        salaire_min: 130001,
        salaire_max: 280000
    },
    {
        taux: 20,
        salaire_min: 280001,
        salaire_max: 530000
    },
    {
        taux: 35,
        salaire_min: 530001,
        salaire_max: Infinity
    }
];

//champs cacher par defaut
var recapField = document.getElementById("recapField");
recapField.style.visibility = "hidden";
recapField.style.position = "absolute";


function determineTranche(salaireBrut) {
    salaireBrut = parseInt(salaireBrut);
    var i = 0;
    // fait la verification seulement pour les 4 premiers elements a cause de infinity
    while (i < baremeIPTS.length - 1 && salaireBrut > baremeIPTS[i].salaire_max) {
        i++;
    }
    return i;
}

function determineTauxReductionIPTS(nbreEnfants) {
    nbreEnfants = parseInt(nbreEnfants);
    var i = 0;
    while (i < tauxReductionIPTS.length-1 && nbreEnfants > tauxReductionIPTS[i].nombreEnfants) {
        i++;
    }
    return tauxReductionIPTS[i].taux;
}

// montantIPTSBrut: c'est l'ITPS calculé sans tenir compte de la charge
function calculreductionIPTS(montantIPTSBrut, nbreEnfants) {
    montantIPTSBrut = parseInt(montantIPTSBrut);
    nbreEnfants = parseInt(nbreEnfants);
    var tauxReduction = determineTauxReductionIPTS(nbreEnfants);
    return (montantIPTSBrut * tauxReduction)/100;
}

function calculIPTS(salaireBrut, nbreEnfants) {
    salaireBrut = parseInt(salaireBrut);
    nbreEnfants = parseInt(nbreEnfants);

    var montantITPSBrut = 0;
    var montantITPSNet = 0;
    
    //determination de la tranche de revenu
    var tranche = determineTranche(salaireBrut);

    //calcul de l'ITPS Brut i.e sans tenir compte des charges
    // +1 a cause des 1 sur les salaire_min
    
    for (let i = 0; i < tranche; i++) {
        montantITPSBrut += ((baremeIPTS[i].salaire_max - baremeIPTS[i].salaire_min + 1) * baremeIPTS[i].taux) / 100;
    }

    montantITPSBrut += ((salaireBrut - baremeIPTS[tranche].salaire_min + 1) * baremeIPTS[tranche].taux) / 100;

    
    montantITPSNet = montantITPSBrut - calculreductionIPTS(montantITPSBrut, nbreEnfants);

    document.getElementById("montantIPTS").innerHTML = "-";

    document.getElementById("montantIPTS").innerHTML = montantITPSNet;
    
    return montantITPSNet;
}

// calcul de l'assurance employe
function calculAssurance(salaireBrut) {
    salaireBrut = parseInt(salaireBrut);
    return salaireBrut * (tauxAssuranceEmploye/100);
}

//calcul du regime de pension
function calculRegimePension(salaireBrut) {
    salaireBrut = parseInt(salaireBrut);
    return salaireBrut * (tauxRegimePension/100);
}

//calcul du VPS
function calculVPS(salaireBrut) {
    salaireBrut = parseInt(salaireBrut);
    return salaireBrut * (tauxVPS/100);
}

//calcul du salaireBrut net
function calculSalaireNet(salaireBrut,nbreEnfants) {
    return (salaireBrut - (calculAssurance(salaireBrut) + calculIPTS(salaireBrut,nbreEnfants) + calculRegimePension(salaireBrut) + calculVPS(salaireBrut)));
}

var submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", myFunction);

function myFunction() {

    // Recuperation des information du formulaire
    var salaireBrut = parseInt(document.getElementById("salaireBrut").value);
    var nbreEnfants = parseInt(document.getElementById("nbreEnfants").value);

    //pour savoir si une valeur saisie
    // à améliorer
    if (salaireBrut >= 0 && nbreEnfants >= 0) {
        
        // cacher les champs de saisi
        var inputFields = document.getElementById("dataField");
        inputFields.style.position = "absolute";
        inputFields.style.visibility = "hidden";

        // affichage champ des informations saisi
        recapField.style.visibility = "visible";
        recapField.style.position = "static";

        //Affichage des differents donnees
        document.getElementById("salaireBrutSaisi").innerHTML += salaireBrut;
        document.getElementById("nbreEnfantsSaisi").innerHTML += nbreEnfants;
        document.getElementById("salaireNetcalculer").innerHTML += "<em style=\"color:tomato\"> " + calculSalaireNet(salaireBrut, nbreEnfants) + "</em>";

        // remplissage du tableau

        document.getElementById("tauxAE").innerHTML = tauxAssuranceEmploye + "%";
        document.getElementById("montantAE").innerHTML = calculAssurance(salaireBrut);

        document.getElementById("tauxRP").innerHTML = tauxRegimePension + "%";
        document.getElementById("montantRP").innerHTML = calculRegimePension(salaireBrut);

        document.getElementById("tauxVPS").innerHTML = tauxVPS + "%";
        document.getElementById("montantVPS").innerHTML = calculVPS(salaireBrut);

        document.getElementById("montantTotal").innerHTML = calculAssurance(salaireBrut) + calculRegimePension(salaireBrut) + calculVPS(salaireBrut) + calculIPTS(salaireBrut,nbreEnfants);
    }
}