// DOM elementlerimim alalım
const productContainer = document.getElementById('product-container');
const btnDiv = document.querySelector('.btn-container');
const shoppingCart = document.getElementById('shopCart');

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
        console.log('Ürünlerin yüklenmesinde sorun çıktı. Hata :' , error);
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
};
productsFromApi();

//Ürünleri filtrelemek için bir fonksiyonm oluşturacağız

function filterProducs(products) {
    /* filtreleme için butonlarımızı gezeceğiz ve butonlara HTML'de eklediğimiz data-category attrinutesinin değerini alacağzız ve ürünlerin categorisiyle karşılaştırma yapacağız eşleşenlen için işleme devam edeceğiz*/

    btnDiv.addEventListener('click', (e) => {
        // e.target ile valuesine ulaşabiliriz
        if (e.target.classList.contains('btn-item')) {
            const category = e.target.dataset.category;
            if(category) {
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

