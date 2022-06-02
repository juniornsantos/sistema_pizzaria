// console.log(pizzaJson);
//variavel do modal numero de pizzas
let modalQt = 1;
//varival do carrinho de compras
let cart =[];
//qual pizza estou selecionando ?
let modalKey = 0;


//funsao para substituir document.querySelector funsao anonima
const c = (e) => document.querySelector(e);
//funsao para substituir document.querySelectorAll funsao anonima
const o = (e) => document.querySelectorAll(e);

//criei uma funcao arrow que recebe item/pizza e o index 
pizzaJson.map((item, index)=>{
    //console.log(item);
    let pizzaItem =c('.models .pizza-item').cloneNode(true);
    //preencha as informacoes em pizza intens

    pizzaItem.setAttribute('data-key',index);

    //nome no html e pizza-item--img
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    //descricao no html e pizza-item--price
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    //nome no html e pizza-item--name
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //descricao no html e pizza-item--desc
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;

        //variavel que armazena as pizza
        modalKey = key;
        //console.log('licada foi:' + key);
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        c('.pizzaInfo--size.selected').classList.remove('selected');
        o('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;


        //uma pequena animação ao abrir o modal da pizza 
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

        // console.log('clicou na pizza');
    });
    

    //adcione em pizza area o meu clone
    c('.pizza-area').append(pizzaItem);
});


// Eventos de cliques para o modal 
// Fechar o modal
function closemodal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

o('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach ((item) => {
    item.addEventListener('click', closemodal);
});

//botoes de mais e menos
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});

//botoes de tamanhos 

o('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//botão adcionar ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //qual a pizza?
    //console.log('Pizza:'+modalKey);
    //qual o tamanho?
    //console.log('Tamanho:'+size);
    //quantas pizzas?
    //console.log('Quantidade:'+modalQt);
    let size = parseInt(c ('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier );
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updatecart();
    closemodal();
});

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0'
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
});

function updatecart (params) {
    c('.menu-openner').innerHTML = cart.length;


    if (cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaitem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaitem.price* cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break
                case 2:
                    pizzaSizeName = 'G';
                    break
            }
            let pizzaname = `${pizzaitem.name} (${pizzaSizeName})`;

            // imagem                 
            cartItem.querySelector('img').src = pizzaitem.img;
            // nome
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaname;

            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener ('click', ()=>{
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updatecart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener ('click',()=>{
                cart[i].qt++;
                updatecart();                

            });

            c('.cart').append(cartItem);

            //console.log(pizzaitem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
