
import { isMobile, removeClasses } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

document.addEventListener('DOMContentLoaded', ()=> { 

    const handleDelegation = (event) => {
        const target = event.target;
        event.preventDefault();
        
        // open/close submenu
        if ( window.innerWidth > 768 && target.matches('.menu__arrow') && isMobile.any()) {
            const menuItem = target.closest('.menu__item');
            menuItem.classList.toggle('_open'); 
        } else if (!target.closest('.menu__item') && document.querySelectorAll('.menu__item._open').length > 0) {
            removeClasses(document.querySelectorAll('.menu__item._open'),'_open');
        }

        // open/close search bar

        if (window.innerWidth < 992 && target.matches('.search-form__icon')) {
            const searchForm = target.nextElementSibling;
            searchForm.classList.toggle('_open'); 
        } else if (!target.closest('.search-form__item') && document.querySelector('.search-form__item._open')) {
            document.querySelector('.search-form__item._open').classList.remove('_open'); 
        }

        // add to cart product
        if (target.matches('.product-actions__btn')) {
            const productId = target.closest('.product-item').dataset.pid;
            addToCart(target, productId);
        }

        // load more products
        if (target.matches('.advantages__more')) {
            loadMoreProducts(event);
        }

        // open/close cart
        if (target.closest('.header-cart__icon') || target.matches('.header-cart__icon')) {
            if (document.querySelector('.header-cart__list').childElementCount) {
                toggleCartClass();
            } 
        } else if (!target.closest('.header-cart._open') && !target.matches('.product-actions__btn')) {
            document.querySelector('.header-cart').classList.remove('_open');
        } 

        // reduce quantity/remove product from cart
        if (target.matches('.header-cart-list__remove')) {
            const productId = target.closest('.header-cart-list__item').dataset.cartPid;
            updateCart(target, productId, false);
        }
    }

    const addToCart = (productButton, productId) => {
        if (productButton.classList.contains('_hold')) return;

        productButton.classList.add('_hold');
        productButton.classList.add('_fly');
        const product = document.querySelector(`[data-pid="${productId}"]`);
        const productImage = product.querySelector('.product-item__image');
        const headerCart = document.querySelector('.header-cart');

        const productImageCoords = {
            width : productImage.offsetWidth,
            height: productImage.offsetHeight,
            left: productImage.getBoundingClientRect().left,
            top: productImage.getBoundingClientRect().top,
        };

        const productFlyImage = productImage.cloneNode(true);

        productFlyImage.setAttribute('class', '_flyImage -ibg');
        productFlyImage.style.cssText =    
                            `
                                top: ${productImageCoords.top}px;
                                left: ${productImageCoords.left}px;
                                width: ${productImageCoords.width}px;
                                height: ${productImageCoords.height}px;
                            `;

        document.body.append(productFlyImage);

        const cartCoords = {  
            left: headerCart.getBoundingClientRect().left,
            top: headerCart.getBoundingClientRect().top,
        };

        productFlyImage.style.cssText = 
                            `
                                top: ${cartCoords.top}px;
                                left: ${cartCoords.left}px;
                                width: 0px;
                                height: 0px;
                                opacity: 0;
                            `;  

        productFlyImage.addEventListener('transitionend', () => {
            if (productButton.classList.contains('_fly')) {
                productFlyImage.remove();
                updateCart(productButton, productId);
                productButton.classList.remove('_fly'); 
            }
        });
        
    }

    const updateCart = (productButton, productId, addItem = true) => {
        const cart = document.querySelector('.header-cart');
        const cartIcon = cart.querySelector('.header-cart__icon');
        let cartQuantity = cartIcon.querySelector('span');
        const cartProduct = cart.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = cart.querySelector('.header-cart__list');
        
        if (addItem) {
            cartQuantity ? cartQuantity.textContent++ 
                        : cartIcon.insertAdjacentHTML('beforeend', '<span>1</span>');

            if (!cartProduct) { 
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const productTitle = product.querySelector('.product-item__title').textContent;
                const productImage = product.querySelector('.product-item__image').innerHTML;
                const productPrice = product.querySelector('.product-item__price').textContent;

                cartList.insertAdjacentHTML('beforeend', `
                        <li class="header-cart-list__item" data-cart-pid="${productId}">
                            <a href="" class="header-cart-list__image header-cart-list__image-ibg">${productImage}</a>
							<div class="header-cart-list__content">
								<a href="" class="header-cart-list__title">${productTitle}</a>
                                <div class="header-cart-list__quantity">Quantity: <span>1</span></div>
								<div class="header-cart-list__price">${productPrice}</div>
							</div>
                            <div class="header-cart-list__remove _icon-icon-delete"></div>  
						</li> 
                ` ); 
            } else {  
                cartProduct.querySelector('.header-cart-list__quantity span').textContent++; 
            }

            productButton.classList.remove('_hold');

        } else {
            const product = document.querySelector(`[data-cart-pid="${productId}"]`);
            let productQuantity = product.querySelector('.header-cart-list__quantity span');

            productQuantity.textContent--;

            if (!Number(productQuantity.textContent)) {  
                product.remove(); 
            } 

            cartQuantity.textContent--;
 
            if (!Number(cartQuantity.textContent)) {
                cartQuantity.remove();
                toggleCartClass();
            }
        } 

    }

    const observeHeader = (entry) => {
        entry[0].isIntersecting 
                ? entry[0].target.classList.remove('_scroll') 
                : entry[0].target.classList.add('_scroll');
    }

    const renderProductLabels = ({labels}) => {
        if (!labels) return '';

        let labelsOutput = '';
        labels.forEach(label => {
            labelsOutput += `<div class="product-item__label product-item__label_${label.type}">
                                ${label.value}
                            </div>`;
        });

        return labelsOutput;
    }

    const toggleCartClass = () => {
        document.querySelector('.header-cart').classList.toggle('_open'); 
    }

    const renderProducts = ({products}) => { 
        if (!Array.isArray(products)) throw new TypeError();

        const productList = document.querySelector('.products__items');
        let productsOutput = '';

        products.forEach(product => { 
            productsOutput += `
                <article data-pid="${product.id}" class="products__item product-item">
                    <div class="product-item__labels">
                        ${renderProductLabels(product)}
                    </div> 
                    <a href="" class="product-item__image product-item__image-ibg">
                        <img src="img/products/${product.image}" alt="">
                    </a> 
                    <div class="product-item__body"> 
                        <div class="product-item__content">
                            <div class="product-item__title">${product.title}</div>
                            <div class="product-item__desc">${product.text}</div>
                        </div>
                        <div class="product-item__prices">
                            <div class="product-item__price">${product.price}</div>
                            ${product.priceOld ? ` <div class="product-item__price product-item__price_old">${product.priceOld}</div>` : ''}
                        </div>
                        <div class="product-item__actions product-actions">
                            <div class="product-actions__body">
                                <a href="" class="product-actions__btn btn btn_white">Add to cart</a>
                                <a href="${product.shareUrl}" class="product-actions__link _icon-share">Share</a>
                                <a href="${product.likeUrl}" class="product-actions__link _icon-favorite">Like</a>
                            </div>
                        </div>
                    </div>
                </article>`;
        });

        productList.insertAdjacentHTML('beforeend', productsOutput); 
    }

    const loadMoreProducts = async (event) => {
        const button = event.target;
        if (button.classList.contains('_hold')) return;
        button.classList.add('_hold'); 
        
        const response = await fetch('json/products.json', {       
            'method' : 'GET', 
            'Content-Type': 'application/json' 
        }); 

        if (response.ok) { 
            const result = await response.json();
            renderProducts(result);
            button.classList.remove('_hold'); 
            button.remove(); 
        } else {
            alert('Some error happened');
        }    
    } 

    document.addEventListener('click', handleDelegation);  

    const header = document.querySelector('.header');
    const observer = new IntersectionObserver(observeHeader);
    observer.observe(header);
});

const furniture = document.querySelector('.furniture__body');

if (furniture && !isMobile.any()) {
    const furnitureItems = furniture.querySelector('.furniture__items');
    const furnitureCols = document.querySelectorAll('.furniture__column');
    const speed = 0.01; 

    let positionX = 0; 
    let coordXprocent = 0;

    const setMouseGalleryStyle = () => {  
        let furnitureFullWidth = [...furnitureCols].reduce((sum, item) => { return item.offsetWidth + sum} ,0);

        const widthDifference = furnitureFullWidth - furniture.offsetWidth;
        const distX = Math.floor(coordXprocent - positionX);
 
        positionX = positionX + (distX * speed);
        let position = widthDifference / 200 * positionX;
        furnitureItems.style.cssText = `transform: translate3d(${-position}px, 0, 0)`; 

        if (Math.abs(distX) > 0) { 
            requestAnimationFrame(setMouseGalleryStyle);
        } else {
            furniture.classList.remove('_init');
        }
    }

    furniture.addEventListener('mousemove', (event) => { 
        const furnitureWidth = furniture.offsetWidth;

        const coordX = event.pageX - furnitureWidth / 2;
        coordXprocent = coordX / furnitureWidth * 200;

        if (!furniture.classList.contains('_init')) { 
            requestAnimationFrame(setMouseGalleryStyle);
            furniture.classList.add('_init');
        }

    });
 
}

