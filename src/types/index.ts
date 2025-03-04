export interface VipPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  image: string;
}

export interface CartItem extends VipPackage {
  quantity: number;
}

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
