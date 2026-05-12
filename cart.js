function dodajDoKoszyka(nazwa, cena, zdjecie){

let koszyk = JSON.parse(localStorage.getItem("koszyk")) || [];

koszyk.push({
nazwa: nazwa,
cena: cena,
zdjecie: zdjecie
});

localStorage.setItem("koszyk", JSON.stringify(koszyk));

alert("Produkt dodany do koszyka 🛒");

window.location.href = "koszyk.html";

}
