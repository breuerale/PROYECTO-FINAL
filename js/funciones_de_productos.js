

document.addEventListener("DOMContentLoaded", () => {
    const productosContainer = document.getElementById("productos-container");

    //Captura de Botones
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    
    let currentPage = 1;
    const limit = 18;
    let totalProductos = 0;


    function fetchProductos(page) {
        const skip = (page - 1) * limit;

        fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
            .then((response) => response.json())
            .then((data) => {
                totalProductos = data.total;
                const productos = data.products;

                productosContainer.innerHTML = "";

                // Generacion de cards
                productos.forEach((product) => {
                    const cardDiv = document.createElement("div");
                    cardDiv.className = "col-md-4";
                    //Creo la card
                    cardDiv.innerHTML = `
<div class="card mt-3 card-custom">
    <img src="${product.thumbnail}" class="card-img-top card-custom-img" alt="${product.title}">
    <div class="card-body d-flex flex-column card-custom-body">
    <h5 class="card-title card-title-custom">${product.title}</h5>
    <p class="card-text card-description">${product.description}</p>
    <p class="card-text fw-bold card-price">Precio: $${product.price}</p>
    <button class="btn btn-custom">Agregar</button>
    </div>
</div>t
`;

                    const botonAgregar = cardDiv.querySelector("button");
                    botonAgregar.addEventListener("click", () => {
                        agregarCarrito(product);
                    });
                    productosContainer.appendChild(cardDiv);
                });


                pageInfo.textContent = `Page ${currentPage}`;
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = (currentPage * limit) >= totalProductos;



            })
            .catch((error) => console.error("Error", error));
    }


    function agregarCarrito(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
    
        // SweetAlert2 en lugar de alert
        Swal.fire({
            icon: 'success', 
            title: `${product.title} agregado al carrito`,  
            text: `El producto fue añadido!`,  
            confirmButtonText: '¡Aceptar!',  
            background: '#ffebf2',  
            color: '#ff69b4',  
            confirmButtonColor: '#ffb6c1',  
        });
    }

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProductos(currentPage);
        }
    });


    nextBtn.addEventListener("click", () => {
        if ((currentPage * limit) < totalProductos) {
            currentPage++;
            fetchProductos(currentPage);
        }
    });



    fetchProductos(currentPage);
});
