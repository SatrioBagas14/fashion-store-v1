const cart = [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}

function updateCart() {
    cartItems.innerHTML = "";

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartTotalPrice.textContent = formatRupiah(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <li class="list-group-item text-center text-muted">
                Keranjang masih kosong.
            </li>
        `;

        return;
    }

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");

        listItem.className = "list-group-item";

        listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start gap-3">

                <div>
                    <strong>${item.name}</strong>

                    <div class="text-muted small mt-1">
                        ${formatRupiah(item.price)} per item
                    </div>
                </div>

                <button
                    type="button"
                    class="btn btn-sm btn-danger remove-item"
                    data-index="${index}"
                    aria-label="Hapus ${item.name}"
                >
                    ✕
                </button>

            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">

                <div class="d-flex align-items-center gap-2">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-dark decrease-quantity"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <span class="fw-bold">
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-dark increase-quantity"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>

                <strong>
                    ${formatRupiah(item.price * item.quantity)}
                </strong>

            </div>
        `;

        cartItems.appendChild(listItem);
    });

    document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.index);

            cart[itemIndex].quantity++;

            updateCart();
        });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.index);

            cart[itemIndex].quantity--;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            updateCart();
        });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.index);

            cart.splice(itemIndex, 1);

            updateCart();
        });
    });
}

addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productName = button.dataset.name;
        const productPrice = Number(button.dataset.price);

        const existingProduct = cart.find(
            (item) => item.name === productName
        );

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCart();
    });
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    let message = "Halo UrbanWear, saya ingin memesan:\n\n";

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        message +=
            `${index + 1}. ${item.name}\n` +
            `Jumlah: ${item.quantity}\n` +
            `Subtotal: ${formatRupiah(itemTotal)}\n\n`;
    });

    message += `Total: ${formatRupiah(totalPrice)}`;

    const phoneNumber = "6281234567890";

    const whatsappUrl =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    cart.length = 0;
updateCart();
});

updateCart();