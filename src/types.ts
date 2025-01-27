export interface Loan {
  businessName: string;
  amountFunded: string;
  currentBalance: string;
  startDate: string;
  monthlyPayment: string;
}

export interface BusinessTradeReference {
  businessName: string;
  contactNameOrAccountNumber: string;
  phone: string;
  relationship: string;
  yearsKnown: string;
}

export interface BusinessPropertyInfo {
  landlordName: string;
  landlordContact: string;
  landlordPhone: string;
  monthlyRent: string;
  leaseStartDate: string;
  leaseEndDate: string;
  squareFootage: string;
}

export interface BusinessFormData {
  // 1. Business Information
  legalName: string;
  dba: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  telephone: string;
  fax: string;
  federalTaxId: string;
  dateStarted: string;
  lengthOwnership: string;
  website: string;
  productService: string;
  email: string;
  entityType: string;
  businessTypes: string[];
  annualRevenue: string;
  monthlyRevenue: string;
  numberOfEmployees: string;
  businessLicense: string;
  businessLicenseExpiry: string;

  // 2. Merchant/Owner Information
  ownerName: string;
  title: string;
  ownershipPercentage: string;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
  ssn: string;
  dateOfBirth: string;
  homePhone: string;
  cellPhone: string;
  creditScore: string;
  driversLicense: string;
  driversLicenseState: string;
  driversLicenseExpiry: string;
  previousBankruptcy: boolean;
  bankruptcyDate: string;
  previousBusiness: boolean;
  previousBusinessDetails: string;

  // 3. Partner Information
  partnerName: string;
  partnerTitle: string;
  partnerOwnershipPercentage: string;
  partnerAddress: string;
  partnerCity: string;
  partnerState: string;
  partnerZip: string;
  partnerSsn: string;
  partnerDateOfBirth: string;
  partnerHomePhone: string;
  partnerCellPhone: string;
  partnerCreditScore: string;
  partnerDriversLicense: string;
  partnerDriversLicenseState: string;
  partnerDriversLicenseExpiry: string;
  partnerPreviousBankruptcy: boolean;
  partnerBankruptcyDate: string;

  // 4. Banking Information
  bankName: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankAccountType: string;
  bankAccountOpenDate: string;
  averageBalance: string;
  numberOfNSF: string;

  // 5. Outstanding Loans
  outstandingLoans: Loan[];

  // 6. Business Property Info
  businessPropertyInfo: BusinessPropertyInfo;

  // 7. Business Trade References
  businessTradeReferences: BusinessTradeReference[];

  // 8. Processing Information
  currentProcessor: string;
  monthlyProcessingVolume: string;
  averageTicket: string;
  terminalType: string;
  cardPresentPercentage: string;
  ecommercePercentage: string;
  mailOrderPercentage: string;
  b2bPercentage: string;

  // 9. Additional Fields / Authorizations
  authorizationDate: string;
  howYouFoundUs: string;
  affiliateId: string;
  signature: string;
  requestedAmount: string;
  fundingPurpose: string;
  timeInBusiness: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  additionalComments: string;
}