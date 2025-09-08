import {API_URL} from "../api/api.js";
import renderCatalog from './catalog.js';

const paginationContainer = document.getElementById("pagination");
export const catalog = document.getElementById("catalog");

export const ITEMS_PER_PAGE = 5;
export let currentPage = 1;
export let totalPages = 1;
export let currentFilter = '';

export default async function  loadProducts(page = 1, filter = '') {
    try {

        const url = new URL(API_URL);

        const query = new URLSearchParams({
            _page: page,
            _per_page: ITEMS_PER_PAGE,

        });
        if (filter) {


            const params = new URLSearchParams(filter);
            params.forEach((value, key) => {
                if (key !== '_page' && key !== '_per_page') {
                    query.set(key, value);
                }

            });

        }

        const response = await fetch(`${url}?${query}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const countQuery = new URLSearchParams();
        if (filter) {
            const params = new URLSearchParams(filter);
            params.forEach((value, key) => {
                if (key !== '_page' && key !== '_per_page') {
                    countQuery.set(key, value);
                }
            });

        }

        const countResponse = await fetch(`${url}?${countQuery}`);
        const allItems = await countResponse.json();
        const totalCount = Array.isArray(allItems) ? allItems.length : allItems.data.length;

        totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        currentPage = page;
        currentFilter = filter;

        const products = await response.json();
        catalog.innerHTML = '';
        await renderCatalog(Array.isArray(products) ? products : products.data);

        updatePaginationControls();
    } catch (error) {
        console.error('Error loading products:', error);
        catalog.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function updatePaginationControls() {
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            if (i !== currentPage) {
                loadProducts(i, currentFilter);
            }
        });
        paginationContainer.appendChild(pageBtn);
    }
}
