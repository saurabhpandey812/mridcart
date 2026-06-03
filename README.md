# ShopEase — E-commerce Application

Full-featured React + TypeScript storefront using the [Platzi Fake Store API](https://fakeapi.platzi.com).

## Features

- **Shop** — Product listing, filters in URL, category navbar, search
- **Product detail** — Add to bag, Buy now, wishlist
- **Bag (Cart)** — Context API + `localStorage`, quantity controls
- **Wishlist** — Save products, dedicated page
- **Checkout** — Delivery address form
- **Payment** — UPI, card, net banking, COD (demo)
- **Orders** — Order history on profile (localStorage)
- **Auth** — Register / login (demo, localStorage)
- **Profile** — Edit name & phone, view orders
- **E2E** — Playwright tests

## Scripts

```bash
npm start
npm run build
npm test
npm run e2e
```

## User flow

1. Browse products → add to bag or wishlist  
2. **Bag** → Place Order → **Checkout** (address) → **Payment** → **Order success**  
3. **Profile** (after login) → orders & account settings  

Demo auth: register any email/password (min 6 chars). Data persists in browser `localStorage`.
