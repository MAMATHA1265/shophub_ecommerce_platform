import heroLocalMarket from '../assets/images/hero_local_market_1794675939782.jpg';
import catGroceryFresh from '../assets/images/cat_grocery_fresh_1794675939887.jpg';
import catFashionLinen from '../assets/images/cat_fashion_linen_1794675941143.jpg';
import catElectronicsAudio from '../assets/images/cat_electronics_audio_1794675940524.jpg';
import catHomeCeramics from '../assets/images/cat_home_ceramics_1794675940310.jpg';
import catBeautyBotanical from '../assets/images/cat_beauty_botanical_1794675941406.jpg';
import catBooksEditorial from '../assets/images/cat_books_editorial_1794675942456.jpg';
import prodPantryArtisan from '../assets/images/prod_pantry_artisan_1794675942021.jpg';
import prodFashionAccessories from '../assets/images/prod_fashion_accessories_1794675941345.jpg';
import prodTechDesk from '../assets/images/prod_tech_desk_1794675942584.jpg';

export const MEDIA_ASSETS: Record<string, string> = {
  'hero-market': heroLocalMarket,
  'grocery-fresh': catGroceryFresh,
  'grocery-pantry': prodPantryArtisan,
  'fashion-linen': catFashionLinen,
  'fashion-accessories': prodFashionAccessories,
  'electronics-audio': catElectronicsAudio,
  'electronics-desk': prodTechDesk,
  'home-ceramics': catHomeCeramics,
  'beauty-botanical': catBeautyBotanical,
  'books-editorial': catBooksEditorial,
  'india-food-bazaar': '/assets/aistudio/India-Food-Bazaar-Shutterstock-1_d0c1d7b7.jpg',
};

export function getMediaUrl(key: string): string {
  return MEDIA_ASSETS[key] ?? heroLocalMarket;
}
