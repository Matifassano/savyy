import { Promotion } from "@/types/dashboard";

export const promotions: Promotion[] = [{
  id: 1,
  bank: "Chase",
  bank_id: "chase",
  title: "10% Cashback on Electronics",
  description: "Get 10% cashback on all electronics purchases above $500",
  validUntil: "2024-05-01",
  category: "Cashback",
  isNew: true,
  cardType: "credit"
}, {
  id: 2,
  bank: "American Express",
  bank_id: "american_express",
  title: "Double Points on Dining",
  description: "Earn 2x points at restaurants worldwide",
  validUntil: "2024-04-15",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 3,
  bank: "Capital One",
  bank_id: "capital_one",
  title: "Travel Insurance Bonus",
  description: "Free travel insurance on flights booked with your card",
  validUntil: "2024-06-30",
  category: "Travel",
  isNew: true,
  cardType: "credit"
}, {
  id: 4,
  bank: "Citibank",
  bank_id: "citibank",
  title: "5% Cash Back on Groceries",
  description: "Earn 5% cash back on grocery store purchases up to $500 monthly",
  validUntil: "2024-07-15",
  category: "Cashback",
  isNew: false,
  cardType: "credit"
}, {
  id: 5,
  bank: "Discover",
  bank_id: "discover",
  title: "3x Points on Gas",
  description: "Triple points on all gas station purchases",
  validUntil: "2024-05-30",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 6,
  bank: "Bank of America",
  bank_id: "bank_of_america",
  title: "Online Shopping Rewards",
  description: "Earn 3% cash back on all online purchases",
  validUntil: "2024-08-15",
  category: "Cashback",
  isNew: true,
  cardType: "debit"
}, {
  id: 7, 
  bank: "Wells Fargo",
  bank_id: "wells_fargo",
  title: "Mobile Wallet Bonus",
  description: "Get $5 back for every $100 spent using mobile wallet payments",
  validUntil: "2024-07-01",
  category: "Cashback",
  isNew: true,
  cardType: "debit"
}, {
  id: 8,
  bank: "Chase",
  bank_id: "chase",
  title: "Streaming Services Reward",
  description: "5x points on streaming service subscriptions",
  validUntil: "2024-06-15",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 9,
  bank: "American Express",
  bank_id: "american_express",
  title: "Hotel Collection Credit",
  description: "$100 credit for eligible hotel stays of 2+ nights",
  validUntil: "2024-09-30",
  category: "Travel",
  isNew: true,
  cardType: "credit"
}, {
  id: 10,
  bank: "Discover",
  bank_id: "discover",
  title: "Debit Card Rewards",
  description: "1% cash back on all debit card purchases",
  validUntil: "2024-08-31",
  category: "Cashback",
  isNew: false,
  cardType: "debit"
}]; 