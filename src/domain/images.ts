import type { Product } from './types.ts'

// Remote photography is for the prototype. Source links are attributed, not product evidence.
export const images: Record<string, NonNullable<Product['image']>> = {
  "roland-fp10": {
    "src": "https://shop.moments.ch/media/f8/e5/cf/1752664426/RO-FP-10-BK.jpg",
    "credit": "Moments (Roland FP-10)",
    "sourceUrl": "https://shop.moments.ch/Roland-FP-10-Digital-Piano/RO-FP-10-BK"
  },
  "yamaha-p145": {
    "src": "https://jp.yamaha.com/files/Image-Index_P-145_d8be19507c43e03bbdc8a364c80592db.jpg?imhei=4000&impolicy=resize&imwid=4000",
    "credit": "Yamaha (P-145)",
    "sourceUrl": "https://jp.yamaha.com/products/musical_instruments/pianos/p_series/p-145/index.html"
  },
  "casio-cdps110": {
    "src": "https://www.costco.com.mx/medias/sys_master/products/hc7/h97/117934514602014.jpg",
    "credit": "Costco Mexico (Casio CDP-S110)",
    "sourceUrl": "https://www.costco.com.mx/Electronicos/Instrumentos-Musicales/Pianos-y-Teclados/Casio-Piano-Digital-Portatil-CDP-S110-de-88-Teclas/p/673794"
  },
  "kawai-es120": {
    "src": "https://www.bonnersmusic.co.uk/cdn/shop/products/editedES120B_above4.jpg?v=1704548350&width=1946",
    "credit": "Bonners Music (Kawai ES120)",
    "sourceUrl": "https://www.bonnersmusic.co.uk/products/kawai-es120-digital-piano-black"
  },
  "yamaha-arius": {
    "src": "https://www.savins.ie/18769-large_default/ydp-145-black-yamaha-arius-digital-piano-only.jpg",
    "credit": "Savins Music (Yamaha YDP-145)",
    "sourceUrl": "https://www.savins.ie/digital-pianos/12571-ydp-145-black-yamaha-arius-digital-piano-only.html"
  },
  "roland-fp30x": {
    "src": "https://chucklevins.com/cdn/shop/files/debd5e52-6b2b-4b9e-87a1-554899197e56_1680x.png?v=1739273116",
    "credit": "Chuck Levin's (Roland FP-30X)",
    "sourceUrl": "https://chucklevins.com/products/roland-fp-30x-digital-piano-black"
  },
  "cove": {
    "src": "https://www.ikea.com/dk/da/images/products/vimle-3-pers-sofa-knaebaeck-lys-beige__1544744_pe1019287_s5.jpg?f=xxl",
    "credit": "IKEA VIMLE",
    "sourceUrl": "https://www.ikea.com/ca/en/p/vimle-sofa-gunnared-beige-s69656435/"
  },
  "forma": {
    "src": "https://www.ikea.com.tw/dairyfarm/tw/images/241/1124111_PE875024_S5.jpg",
    "credit": "IKEA KIVIK",
    "sourceUrl": "https://www.ikea.com/ca/en/p/kivik-sofa-tresund-light-beige-s29482833/"
  },
  "milo": {
    "src": "https://www.ikea.is/static/web/ikea4/images/543/0054390_PE087573_S4.jpg?v=fb3e6f44",
    "credit": "IKEA KLIPPAN",
    "sourceUrl": "https://www.ikea.is/en/products/sofas/all-sofas-covers/sofas/klippan-frame-2-seat-sofa-art-10072256"
  },
  "sunday": {
    "src": "https://ikeagreece.akamaized.net/images/510x510/4/variantimages/50341148/3.jpg",
    "credit": "IKEA FRIHETEN",
    "sourceUrl": "https://www.ikea.gr/en/products/friheten-three-seat-sofa-bed/50341148/"
  },
  "arc": {
    "src": "https://www.ikea.com/ca/en/images/products/morabo-sofa-grann-bomstad-golden-brown-wood__1576948_pe1032847_s5.jpg",
    "credit": "IKEA MORABO",
    "sourceUrl": "https://www.ikea.com/ca/en/p/morabo-sofa-grann-bomstad-golden-brown-wood-s29317758/"
  },
  "macbook-air-m4": { src: "https://www.shopdunk.com/images/thumbs/0055933_macbook-air-m4-13-inch-10-core-gpu-16gb-ram-512gb-ssd.png", credit: "ShopDunk (MacBook Air M4)", sourceUrl: "https://shopdunk.com/macbook-air-m4-13-inch-10-core-gpu-16gb-ram-512gb-ssd" },
  "dell-inspiron14": { src: "https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/inspiron/14-5440-metal-non-touch/in5440nt-cnb-05000ff095-ice-bl-fpr-metal.psd?$S7-480wide$=", credit: "Dell (Inspiron 14)", sourceUrl: "https://www.dell.com/de-de/shop/deals/pc-laptop-deals" },
  "asus-zenbook14": { src: "https://id.store.asus.com/media/catalog/product/z/e/zenbook_14_oled_ux3405ma_product_photo_3s_foggy_silver_03_1.jpg", credit: "ASUS (Zenbook 14 OLED)", sourceUrl: "https://id.store.asus.com/90nb14w4-m00r60-ux3405ca-oled5112tm.html" },
  "lenovo-yoga7i": { src: "https://s3-ap-southeast-2.amazonaws.com/wc-prod-pim/JPEG_1000x1000/LE83JQ000E_.jpg", credit: "Officeworks (Lenovo Yoga 7i)", sourceUrl: "https://www.officeworks.com.au/shop/officeworks/p/lenovo-14-yoga-7i-2-in-1-copilot-pc-core-ultra-7-32gb-1tb-le83jq000e" },
  "thinkpad-e14": { src: "https://www.firstshop.co.za/cdn/shop/files/21m7001yza-windows-laptops-1130254138.jpg?v=1739469874&width=1214", credit: "FirstShop (Lenovo ThinkPad E14)", sourceUrl: "https://www.firstshop.co.za/products/lenovo-thinkpad-e14-g6-14-inch-wuxga-laptop-intel-core-ultra-7-155h-512gb-ssd-16gb-ram-win-11-pro-21m7001yza-191080" },
  "hp-envy-x360": { src: "https://samazon.ae/cdn/shop/files/52730524172291-prod_xl-1500x1500_1024x1024.jpg?v=1729874125", credit: "Samazon (HP Envy x360)", sourceUrl: "https://samazon.ae/products/hp-envy-x360-15-fh0013dx-convertible-amd-ryzen-5-7530u-2-0ghz-8gb-ram-256gb-ssd-15-6-inch-fhd-touch-display-windows-11" },
}
