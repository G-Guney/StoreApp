// DOM elementlerimim alalım
const productContainer = document.getElementById('product-container');
const btnDiv = document.querySelector('.btn-container');
const shoppingCart = document.getElementById('shopCart');
const cartButton = document.getElementById('cartBtn');
// sepetimimize tıklanınca açılır kapanır yapacağız

cartButton.addEventListener('click', () => {
    if (shoppingCart.style.display === 'none') {
        shoppingCart.style.display = 'block';
    } else {
        shoppingCart.style.display = 'none';
    }
});


// Sepete eklenen ürünlerimizi saklayacağımız bir dizi oluşturuyoruz ilk başta boş olacak
let shopItems = [];

/* API'den ürünlerimizi Çekelim
bunun için fetch() kullanacağz, API'den çekme işleminde async ve await kullanmamız gerekir.
Datalarımızı çekeceğimiz bir fonksiyon yazacağız.
*/
async function productsFromApi() {
    // çekme işlemi yaparken herhangi bir hata durmu ile karşılaşabiliriz bunun için try-catch kullanacağız
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        // verilerimizi çektikten sonra json formatına çeviriyoruz
        const products = await response.json();
        // console.log(products); // <--ürünler geimiş mi kontrol edelim
        displayProducts(products);
        filterProducs(products);
    }
    catch (error) {
        console.log('Ürünlerin yüklenmesinde sorun çıktı. Hata :', error);
    }
};
/* Şimdi ürümlerimizi ekrana yazdırma işlemi için bir fonlsiyon oluşturacağız, bu fonksiyon API'den alaınan verileri işleyecek , API'den async ile veri aldığımız için bu fonksiyonu productsFromApi()'nin dışından çağıramayız. Oluşturduktan sonra içerisine yazacağız
*/
function displayProducts(products) {
    // ürün için bir card oluşturuyoruz içine HTML Yazacağız
    // map() metodu ile API'den gelen verileri dolaşacağız ve teker teker ürün olarak return ile döndüreceğiz


    const productCard = products.map((product) => {
        return `
        <div class="card m-2 col-md-6 col-sm-12" style="width: 18rem;">
            <img src="${product.image}" class="card-img p-2 img-fluid" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="">${product.price}$<p/>
            </div>
            <div class="card-btns">
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add To Card</button>
                <button class="btn btn-info ">Detail</button>
            </div>
        </div>
        `;
    }).join(''); // join() metodu kullanma sebebimiz map() metodu kullandığımızda verileri bir diziye ekler ve aralarında virgül olur virgülü kaldırmak için kullanırız.
    // ürün cardlarını oluşturduk şimdi ekrana yazdıralım
    productContainer.innerHTML = productCard;

    // ürünlerimiz eklendiğinde sepete ekleme butonu ile gelecek butonlara event listener ile bir fonksiyon tanıyacağız

    const addCartButtons = document.querySelectorAll('.add-to-cart');
    addCartButtons.forEach((button) => {
        button.addEventListener('click', addToCart);
        // butonların hepsine bu fonksiyon tanımlandı, aşağıda fonksiyonumuzu tanımlayacağız
    })
};

//Ürünleri filtrelemek için bir fonksiyonm oluşturacağız

function filterProducs(products) {
    /* filtreleme için butonlarımızı gezeceğiz ve butonlara HTML'de eklediğimiz data-category attrinutesinin değerini alacağzız ve ürünlerin categorisiyle karşılaştırma yapacağız eşleşenlen için işleme devam edeceğiz*/

    btnDiv.addEventListener('click', (e) => {
        // e.target ile valuesine ulaşabiliriz
        if (e.target.classList.contains('btn-item')) {
            const category = e.target.dataset.category;
            if (category) {
                // buton all ise hepsini gösterecek
                // değilse categorisine göre
                const filterProducs = category === 'all' ? products : products.filter((product) => product.category === category);
                // filtreleme yaptık ve değişkene atadık
                // ekrana yazdırmak için kullandığımız fonksiyona değişekeni göndereceğiz
                displayProducts(filterProducs);
            }
        }
    })
};

// SEpete ürün Ekleme işlevi için fonksiyon yazacağız

function addToCart(e) {
    // butonla oluşturulken ürünlerin id'si butonlara eklendi id' kllanarak işlem yapacağız
    // öncelikle id'yi alalım
    const id = e.target.dataset.id;
    /* id aldık öncelikle yapmamız gereken shopItems dizisinde bu id'yi taratmak ,taratma sebebimiz eğer sepetimizde bu id ile eşleşen ürün var ise sepetteki sayısını arttıracağız yok ise sepete sıfırdan ekleyeceğiz*/
    const item = shopItems.find((item) => item.id === id);

    if (item) {
        item.count += 1;
    }
    else {
        const product = {
            id: id,
            count: 1,
            // sepette image ve price göstermek için ürüne ait olanlarıda burada eklememiz gerekli
            image: e.target.parentElement.parentElement.querySelector('.card-img').src,
            price: e.target.parentElement.parentElement.querySelector('.card-title').nextElementSibling.innerText,
        };
        console.log(product);
        shopItems.push(product);
    }
    // ürün il defa ekleniyorsa ürüne butondanb aldığımız id'yi verdik ve başlangıçta sepetteki sayısına 1 değerini verdik

    // sepete ekleme işlemi tamamlandığına göre sepeti güncellememiz gerekli bunun için bir fonk yazacağız , ekleme fonksiyonunada bu fonksiyonu yazmamız gerekecek
    updateShopItems();
}
// Sepetten ürün silme
function removeItemFromCart() {
    // remove butonlarını seçelim
    const removeButtons = document.querySelectorAll('.remove');

    // event ekleyerek sepetten çıkaracağız
    removeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            // burada closest metodu kullandık en yakın parenti alacak
            const id = e.target.closest('.shop-item').querySelector('.shop-price').dataset.id;
            // id 'si eşleşmeyenler sepette kalacak
            shopItems = shopItems.filter((item) => item.id !== id);

            // Sepeti güncelliyoruz
            updateShopItems();
        });
    });
}

// ürün güncelleme fonskiyonu - ürün silme fonksiyonunda içerir
function updateShopItems() {
    const shoppingCartItem = shopItems.map((item) => {
        return `
        <li class="shop-item d-flex justify-content-between align-items-center p-2" >
            <img src="${item.image}" alt="">
            <div class="shop-price text-white" data-id="${item.id}">${item.price}</div>
            <span class="count text-white">${item.count}</span>
            <button class="remove btn btn-danger"><i class="fas fa-trash"></i></button>
        </li>
        `;
    }).join('');

    // sepete yazdırma
    shoppingCart.innerHTML = shoppingCartItem;
    removeItemFromCart();
}


productsFromApi();
