import loadProducts from './pagination.js';
import renderCatalog from './catalog.js';
import {API_URL} from "../api/api.js";
import catalog from './pagination.js';

const search = document.getElementById("search");
const sort = document.getElementById("sort");
const sortCategory = document.getElementById("sortCategory");

const reset = document.getElementById("reset");
const btnFilter = document.getElementById("btnFilter");
const btnReduce = document.getElementById("btnReduce");
const btnEvery = document.getElementById("btnEvery");
const btnFind = document.getElementById("btnFind");
const btnTop3 = document.getElementById("btnTop3");


async function fetchAllItems(query = '') {
    const response = await fetch(`${API_URL}${query}`);
    return await response.json();
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

async function initSorting() {
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");

    function applyFilters() {
        let filters = [];

        if (minPriceInput.value) {
            filters.push(`price_gte=${minPriceInput.value}`);
        }
        if (maxPriceInput.value) {
            filters.push(`price_lte=${maxPriceInput.value}`);
        }

        const searchTerm = search.value.trim();
        if (searchTerm) {
            filters.push(`name=${encodeURIComponent(searchTerm)}`);
        }

        if (sort.value !== "default") {
            const order = sort.value === "rating" ? "desc" : "asc";
            filters.push(`_sort=${sort.value}&_order=${order}`);
        }

        if (sortCategory.value !== "default") {
            filters.push(`category=${sortCategory.value}`);
        }

        loadProducts(1, filters.join("&"));
    }

    minPriceInput.addEventListener("input", debounce(applyFilters, 500));
    maxPriceInput.addEventListener("input", debounce(applyFilters, 500));

    search.addEventListener("input", debounce(applyFilters, 500));
    sort.addEventListener("change", applyFilters);
    sortCategory.addEventListener("change", applyFilters);

    reset.addEventListener("click", () => {
        search.value = "";
        sort.value = "default";
        sortCategory.value = "default";
        minPriceInput.value = "";
        maxPriceInput.value = "";
        loadProducts(1);
    });

    btnFilter.addEventListener("click", () => {
        loadProducts(1, "price_gte=300");
    });

    btnReduce.addEventListener('click', async () => {
        const products = await fetchAllItems();
        const total = products.reduce((sum, product) => sum + product.price, 0);
        alert(`Общая стоимость всех товаров: ${total} руб`);
    });

    btnEvery.addEventListener("click", async () => {
        loadProducts(1, "price_gte=400");
    });

    btnFind.addEventListener("click", async () => {
        const products = await fetchAllItems();
        const foundProduct = products.find(product => product.price > 450);
        if (foundProduct) {
            renderCatalog([foundProduct]);
        } else {
            catalog.innerHTML = '<p class="no-products">Товар не найден</p>';
        }
    });

    btnTop3.addEventListener('click', async () => {
        loadProducts(1, "_sort=price&_order=asc&_limit=3");
    });
}

document.addEventListener('DOMContentLoaded', initSorting);