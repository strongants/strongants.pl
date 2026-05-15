function dodajDoKoszyka(nazwa, cena, obraz){

let koszyk = JSON.parse(localStorage.getItem("koszyk")) || [];

koszyk.push({
nazwa: nazwa,
cena: cena,
obraz: obraz
});

localStorage.setItem("koszyk", JSON.stringify(koszyk));

alert("Produkt dodany do koszyka 🛒");

window.location.href = "koszyk.html";

}
