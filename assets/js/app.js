let leviMeni = document.querySelector('.left-menu');
let desniMeni = document.querySelector('.right-menu');
let allIncrement = document.querySelectorAll('.increment');
let allDecrement = document.querySelectorAll('.decrement');
let currentOrder = [];
let tables = document.querySelector('main')
let count = document.querySelectorAll('.count')
let orderFromDb = document.querySelector('.order-from-db')
let db = firestore.collection('restoran')

// Prikazivanje order menija klikom na sto
let stolovi = document.querySelectorAll('.table');
[...stolovi].forEach((sto,index) => {
    sto.addEventListener('click', function() {
        let brojStola = index + 1;
        localStorage.setItem('brojStola', brojStola)

        let ref = db.doc(`table-${brojStola}`)
        ref.get().then( doc => {
            let data = doc.data()
            if(data.order) {
                desniMeni.classList.add('show')               
                tables.classList.add('disable')
                displayOrderInfo(data)               
            } else {
                leviMeni.classList.add('show')
                tables.classList.add('disable')               
            }
        })

    })
});

// Funkcija za fecovanje JSON-a sa slikama
fetchImages = () => {
    return new Promise((resolve,reject) => {
        const request = new XMLHttpRequest();
        request.addEventListener('readystatechange', ()=>{
            if(request.readyState === 4 && request.status === 200){
                const data = JSON.parse(request.responseText)
                resolve(data);
                updateUI(data);
            } else if(request.readyState === 4) {
                reject()
            }
        })
        request.open('GET', 'https://api.myjson.com/bins/b8l8p');
        request.send();
    })
}

// Funkcija za dodavanje fecovanih slika u img src u meniju
updateUI = (data) => {
    let pizzaImg = document.querySelector('.pizza .card img')
    let pastaImg = document.querySelector('.pasta .card img')
    let priloziImg = document.querySelector('.prilozi .card img')
    let piceImg = document.querySelector('.pice .card img')

    pizzaImg.setAttribute('src', data.pizzaUrl)
    pastaImg.setAttribute('src', data.pastaUrl)
    priloziImg.setAttribute('src', data.prilogUrl)
    piceImg.setAttribute('src', data.piceUrl)
}

// Increment funkcija za kolicinu
increment = () => {
    let curr = event.target.nextElementSibling.innerHTML
    curr++
    event.target.nextElementSibling.innerHTML = curr
}

// Decrement funkcija za kolicinu
decrement = () => {
    let curr = event.target.previousElementSibling.innerHTML
    if(curr > 0){
        curr-- 
    }
    event.target.previousElementSibling.innerHTML = curr
}

allIncrement.forEach(item => {
    item.addEventListener('click',() => {
        increment()
    })
})

allDecrement.forEach(item => {
    item.addEventListener('click',() => {
        decrement()
    })
})

// Konstrutori koje factory funkcija koristi
// za hranu
function Food(options){
    this.name = options.options.name;
    this.price = this.price();
}
Food.prototype.price = function(){
    return Math.floor(Math.random() * (600 - 300) + 300);
}

// za prilog
function Topping(options){
    this.name = options.options.name;
    this.price = this.price();
}
Topping.prototype.price = function(){
    return Math.floor(Math.random() * (100 - 20) + 20);
}

// za pice
function Drink(options){
    this.name = options.options.name;
    this.volume = options.options.volume;
    this.price = this.price();
}
Drink.prototype.price = function(){
    return Math.floor(Math.random() * (500 - 150) + 150);
}

// Definisanje factory funkcije
let FactoryDish = function(){}

// Funkcija unutar factory koja instancira klase u zavisnosti
// od tipa hrane/pica/priloga
FactoryDish.prototype.create = function(options){
    let generisan;
    switch(options.options.tip){
        case 'pizza':
        case 'pasta':
            generisan = new Food(options)
            break;
        case 'topping':
            generisan = new Topping(options);
            break;
        case 'drink':
            generisan = new Drink(options);
            break;
    }
    return generisan
}

// Dodavanje u korpu
addToOrder = (options) => {
    currentOrder.push(new FactoryDish().create({options}))
}

// Brisanje iz korpe
removeFromOrder = (name) => {
    currentIndex = currentOrder.findIndex( item => {
        return name == item.name
    })
    currentOrder.splice(currentIndex, 1)
}


// Narucivanje
newOrder = () => {
    if(currentOrder.length > 0) {
        let currentTable = localStorage.getItem('brojStola')
    
        let ref = db.doc(`table-${currentTable}`)
        ref.set({
            order: JSON.stringify(currentOrder)
        }, {merge: true})

        alert('Vasa porudbina je zabelezena')
        currentOrder = []
        leviMeni.classList.remove('show')
        tables.classList.remove('disable')               
        resetAll()
    } else {
        alert('Morate izabrati makar jedan proizvod')
    }
}

// Odustajanje
abandonOrder = () => {
    currentOrder = []
    leviMeni.classList.remove('show')
    desniMeni.classList.remove('show')
    tables.classList.remove('disable')               
    resetAll()
}

// Ispisivanje podataka o porudzbini
displayOrderInfo = (data) => {
    let order = JSON.parse(data.order)
    let totalPrice = order.map( item => item.price).reduce( (sum, curr) => sum + curr)
    let orderText = `<h4>Porudzbina Stola broj ${data.id}:</h4><ul>`
    order.forEach(item => {
        orderText += `<li>Naziv: <strong>${item.name}</strong></li><ul><li>Cena: <strong>${item.price}din</strong></li></ul>`
    })
    orderText += `</li></ul>
    <hr>
    <h4>Ukupna cena: ${totalPrice}din</h4
    `

    orderFromDb.innerHTML = orderText
}

// Placanje (uklanjanje podataka o porudzbini iz baze)
pay = () => {
    let currentTable = localStorage.getItem('brojStola')
    let ref = db.doc(`table-${currentTable}`)

    ref.update({
    order: firebase.firestore.FieldValue.delete()
    });

    alert('Vasa porudbina je placena')
    currentOrder = []
    desniMeni.classList.remove('show')
    tables.classList.remove('disable') 
}

// Resetovanje svih kolicina na 0
resetAll = () => {
    count.forEach( item => {
        item.innerHTML = 0;
    })
}


fetchImages()