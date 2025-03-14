import { Promotion } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch promotions from Supabase
export async function fetchPromotionsFromSupabase(): Promise<Promotion[]> {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
    
    // Transform data to match Promotion type
    return data.map((promo: any, index: number) => ({
      id: promo.id || index + 1,
      bank: promo.bank || '',
      title: promo.title || '',
      benefits: promo.benefits || '',
      cardtype: promo.cardtype || '',
      link_promotion: promo.link_promotion || '',
      payment_network: promo.payment_network || '',
      valid_until: promo.valid_until || ''
    }));
  } catch (error) {
    console.error('Error in fetchPromotionsFromSupabase:', error);
    return [];
  }
}

// Default empty array for promotions
export const promotions: Promotion[] = [];

// Initialize promotions on the client side
if (typeof window !== 'undefined') {
  fetchPromotionsFromSupabase().then(data => {
    // Update the promotions array with fetched data
    promotions.length = 0;
    promotions.push(...data);
  });
}
