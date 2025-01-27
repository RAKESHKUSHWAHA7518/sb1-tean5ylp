// src/App.tsx (or wherever your main component lives)
import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Send,
  Loader2,
  Plus,
  Trash2,
  Building,
  User,
  Home,
  DollarSign,
  PenTool,
  ClipboardList,
  CreditCard,
  Landmark,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PDFTemplate } from "./components/PDFTemplate";
import { generatePDF } from "./utils/generatePDF";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from './your-firebase-config-file';
import { storage } from './utils/firebase';

// Types
import type {
  Loan,
  BusinessTradeReference,
  BusinessPropertyInfo,
  BusinessFormData,
} from "./types";
import { log } from "console";

const states = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

/**
 * A reusable "SectionCard" component
 */
function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="p-6 bg-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}

export default function App() {
  // ----------------------------
  // REACT-HOOK-FORM SETUP
  // ----------------------------
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessFormData>({
    defaultValues: {
      // 1. Business Information
      legalName: "ABC Enterprises, Inc.",
      dba: "ABC Consulting",
      address: "123 Main St., Suite 4",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      telephone: "(555) 555-5555",
      fax: "(555) 555-5556",
      federalTaxId: "12-3456789",
      dateStarted: "2024-01-01",
      lengthOwnership: "1 year",
      website: "https://example.com",
      productService: "IT Consulting",
      email: "info@example.com",
      entityType: "llc",
      businessTypes: ["retail", "wholesale"],
      annualRevenue: "1000000",
      monthlyRevenue: "83333",
      numberOfEmployees: "10",
      businessLicense: "BL123456",
      businessLicenseExpiry: "2025-12-31",

      // 2. Merchant/Owner Information
      ownerName: "John Smith",
      title: "CEO",
      ownershipPercentage: "100",
      ownerAddress: "456 Oak Street",
      ownerCity: "Los Angeles",
      ownerState: "CA",
      ownerZip: "90002",
      ssn: "123-45-6789",
      dateOfBirth: "1980-01-01",
      homePhone: "(555) 555-1111",
      cellPhone: "(555) 555-2222",
      creditScore: "750",
      driversLicense: "D1234567",
      driversLicenseState: "CA",
      driversLicenseExpiry: "2025-01-01",
      previousBankruptcy: false,
      bankruptcyDate: "",
      previousBusiness: false,
      previousBusinessDetails: "",

      // 3. Partner Information
      partnerName: "Jane Doe",
      partnerTitle: "COO",
      partnerOwnershipPercentage: "50",
      partnerAddress: "789 Pine Street",
      partnerCity: "Los Angeles",
      partnerState: "CA",
      partnerZip: "90003",
      partnerSsn: "987-65-4321",
      partnerDateOfBirth: "1985-01-01",
      partnerHomePhone: "(555) 555-3333",
      partnerCellPhone: "(555) 555-4444",
      partnerCreditScore: "780",
      partnerDriversLicense: "D7654321",
      partnerDriversLicenseState: "CA",
      partnerDriversLicenseExpiry: "2025-01-01",
      partnerPreviousBankruptcy: false,
      partnerBankruptcyDate: "",

      // 4. Banking Information
      bankName: "First National Bank",
      bankAccountNumber: "1234567890",
      bankRoutingNumber: "123456789",
      bankAccountType: "checking",
      bankAccountOpenDate: "2020-01-01",
      averageBalance: "50000",
      numberOfNSF: "0",

      // 5. Outstanding Loans
      outstandingLoans: [
        {
          businessName: "First Bank",
          amountFunded: "50000",
          currentBalance: "30000",
          startDate: "2023-01-01",
          monthlyPayment: "2500",
        },
      ],

      // 6. Business Property Info
      businessPropertyInfo: {
        landlordName: "XYZ Real Estate Management",
        landlordContact: "Landlord Contact #123",
        landlordPhone: "(555) 555-7777",
        monthlyRent: "5000",
        leaseStartDate: "2023-01-01",
        leaseEndDate: "2025-12-31",
        squareFootage: "2500",
      },

      // 7. Business Trade References
      businessTradeReferences: [
        {
          businessName: "Acme Supply",
          contactNameOrAccountNumber: "John Doe #1234",
          phone: "(555) 555-1234",
          relationship: "Supplier",
          yearsKnown: "5",
        },
      ],

      // 8. Processing Information
      currentProcessor: "Square",
      monthlyProcessingVolume: "100000",
      averageTicket: "250",
      terminalType: "Point of Sale",
      cardPresentPercentage: "80",
      ecommercePercentage: "10",
      mailOrderPercentage: "5",
      b2bPercentage: "5",

      // 9. Additional Fields
      authorizationDate: "2025-01-01",
      howYouFoundUs: "Online search",
      affiliateId: "",
      signature: "",
      requestedAmount: "100000",
      fundingPurpose: "Expansion",
      timeInBusiness: "5",
      preferredContactMethod: "email",
      bestTimeToContact: "morning",
      additionalComments: "",
    },
  });

  // Arrays for "Outstanding Loans" and "Business Trade References"
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outstandingLoans",
  });
  const {
    fields: tradeRefFields,
    append: appendTradeRef,
    remove: removeTradeRef,
  } = useFieldArray({
    control,
    name: "businessTradeReferences",
  });

  // ----------------------------
  // STATE FOR SUBMISSION STATUS
  // ----------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // PDF ref for capturing the template
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Pre-fill or set form values on mount
  React.useEffect(() => {
    setValue("state", "CA");
    setValue("ownerState", "CA");
    setValue("partnerState", "CA");
  }, [setValue]);

  React.useEffect(() => {
    setValue("businessTypes", ["retail", "wholesale"]);
  }, [setValue]);

  // ----------------------------
  // FORM SUBMISSION
  // ----------------------------
  const onSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    let pdfBlob;
    try {
      // 1) Generate and download PDF
      // await generatePDF(pdfTemplateRef, data);
      // const pdfFile = await generatePDF(templateRef, formData);


      const pdfBlob = await generatePDF(pdfTemplateRef, data);
      console.log(pdfBlob );
      
      
      if (!pdfBlob) {
        throw new Error("Failed to generate PDF");
      }

      // 2) Upload PDF to Firebase
      const fileName = `forms/${Date.now()}_form.pdf`;
      const storageRef = ref(storage, fileName);
      
      const metadata = {
        contentType: 'application/pdf',
        customMetadata: {
          formId: Date.now().toString(),
          userEmail: data.email || 'anonymous'
        }
      };

      const uploadTask = await uploadBytes(storageRef, pdfBlob, metadata);
      const pdfUrl = await getDownloadURL(uploadTask.ref);
      
      console.log("PDF uploaded successfully:", pdfUrl);
      
      const enrichedData = {
        ...data,
         pdflink: pdfUrl,  // Add your new field here
        timestamp: new Date().toISOString(),  // Example of adding a timestamp
        // Add any other fields you need
    };
      
    console.log(enrichedData);
    
      // 2) Send the data to the webhook
      const response = await fetch(
        "https://hook.us2.make.com/ivpkt0t0696iu68ffiqvmewkebfost1b", // replace with your actual Make/Webhook URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enrichedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus({
        type: "success",
        message: "Form submitted successfully and PDF downloaded!",
      });
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new fields in the array sections
  const addLoan = () => {
    append({
      businessName: "",
      amountFunded: "",
      currentBalance: "",
      startDate: "",
      monthlyPayment: "",
    });
  };
  const addTradeReference = () => {
    appendTradeRef({
      businessName: "",
      contactNameOrAccountNumber: "",
      phone: "",
      relationship: "",
      yearsKnown: "",
    });
  };

  // For tracking percentages dynamically
  const ownerPercentage = watch("ownershipPercentage") || "0";
  const partnerPercentage = watch("partnerOwnershipPercentage") || "0";

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 md:px-8">
      {/* Title */}
      <motion.div
        className="max-w-4xl mx-auto mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-900">
          Business Application Form
        </h1>
        <p className="text-gray-600 mt-2">
          Please fill out all the required information below
        </p>
      </motion.div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* 1. Business Information */}
          <SectionCard
            icon={Building}
            title="Business Information"
            description="Basic information about your business entity"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="legalName" className="font-medium">
                  Legal/Corporate Name *
                </Label>
                <Input
                  id="legalName"
                  {...register("legalName", { required: true })}
                  placeholder="Enter legal or corporate name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="dba" className="font-medium">
                  DBA (Doing Business As)
                </Label>
                <Input
                  id="dba"
                  {...register("dba")}
                  placeholder="Enter DBA name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="annualRevenue" className="font-medium">
                  Annual Revenue *
                </Label>
                <Input
                  id="annualRevenue"
                  {...register("annualRevenue", { required: true })}
                  placeholder="Enter annual revenue"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="monthlyRevenue" className="font-medium">
                  Monthly Revenue *
                </Label>
                <Input
                  id="monthlyRevenue"
                  {...register("monthlyRevenue", { required: true })}
                  placeholder="Enter monthly revenue"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="numberOfEmployees" className="font-medium">
                  Number of Employees *
                </Label>
                <Input
                  id="numberOfEmployees"
                  {...register("numberOfEmployees", { required: true })}
                  placeholder="Enter number of employees"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="businessLicense" className="font-medium">
                  Business License Number *
                </Label>
                <Input
                  id="businessLicense"
                  {...register("businessLicense", { required: true })}
                  placeholder="Enter business license number"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="businessLicenseExpiry"
                  className="font-medium"
                >
                  License Expiry Date *
                </Label>
                <Input
                  id="businessLicenseExpiry"
                  type="date"
                  {...register("businessLicenseExpiry", { required: true })}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="address" className="font-medium">
                  Business Address *
                </Label>
                <Input
                  id="address"
                  {...register("address", { required: true })}
                  placeholder="Enter business address"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="city" className="font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  {...register("city", { required: true })}
                  placeholder="Enter city"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="state" className="font-medium">
                  State *
                </Label>
                <Select
                  onValueChange={(value) => setValue("state", value)}
                  defaultValue="CA"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="zip" className="font-medium">
                  ZIP Code *
                </Label>
                <Input
                  id="zip"
                  {...register("zip", {
                    required: true,
                    pattern: /^\d{5}(-\d{4})?$/,
                  })}
                  placeholder="Enter ZIP code"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="telephone" className="font-medium">
                  Phone *
                </Label>
                <Input
                  id="telephone"
                  {...register("telephone", {
                    required: true,
                    pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
                  })}
                  placeholder="(XXX) XXX-XXXX"
                  className="mt-1"
                />
              </div>

              {/* Added Email Field */}
              <div className="flex flex-col">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="fax" className="font-medium">
                  Fax
                </Label>
                <Input
                  id="fax"
                  {...register("fax", {
                    pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
                  })}
                  placeholder="(XXX) XXX-XXXX"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Type of Entity */}
            <div className="mt-6">
              <Label className="font-medium mb-2 block">Type of Entity</Label>
              <RadioGroup
                onValueChange={(value) => setValue("entityType", value)}
                defaultValue="llc"
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="soleProprietorship"
                    id="soleProprietorship"
                  />
                  <Label htmlFor="soleProprietorship">
                    Sole Proprietorship
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partnership" id="partnership" />
                  <Label htmlFor="partnership">Partnership</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporation" id="corporation" />
                  <Label htmlFor="corporation">Corporation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="llc" id="llc" />
                  <Label htmlFor="llc">LLC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Business Type Selection */}
            <div className="mt-6">
              <Label className="font-medium mb-2 block">Type of Business</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["retail", "wholesale", "restaurant", "supermarket", "moto", "other"].map(
                  (type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        defaultChecked={["retail", "wholesale"].includes(type)}
                        onCheckedChange={(checked) => {
                          const value = checked ? type : "";
                          const current = watch("businessTypes") || [];
                          // If "unchecked", remove from array; if "checked", add to array
                          const updated = checked
                            ? [...current, value]
                            : current.filter((t: string) => t !== type);

                          setValue("businessTypes", updated);
                        }}
                      />
                      <Label htmlFor={type} className="capitalize">
                        {type}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>
          </SectionCard>

          {/* 2. Merchant/Owner Information */}
          <SectionCard
            icon={User}
            title="Merchant/Owner Information"
            description="Details about the primary business owner"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="ownerName" className="font-medium">
                  Owner Name *
                </Label>
                <Input
                  id="ownerName"
                  {...register("ownerName", { required: true })}
                  placeholder="Enter owner name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="creditScore" className="font-medium">
                  Credit Score *
                </Label>
                <Input
                  id="creditScore"
                  {...register("creditScore", { required: true })}
                  placeholder="Enter credit score"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="driversLicense" className="font-medium">
                  Driver's License Number *
                </Label>
                <Input
                  id="driversLicense"
                  {...register("driversLicense", { required: true })}
                  placeholder="Enter driver's license number"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="driversLicenseState"
                  className="font-medium"
                >
                  License State *
                </Label>
                <Select
                  onValueChange={(value) => setValue("driversLicenseState", value)}
                  defaultValue="CA"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="driversLicenseExpiry"
                  className="font-medium"
                >
                  License Expiry Date *
                </Label>
                <Input
                  id="driversLicenseExpiry"
                  type="date"
                  {...register("driversLicenseExpiry", { required: true })}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label className="font-medium mb-2">
                  Previous Bankruptcy?
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="previousBankruptcy"
                    onCheckedChange={(checked) => {
                      setValue("previousBankruptcy", checked as boolean);
                    }}
                  />
                  <Label htmlFor="previousBankruptcy">Yes</Label>
                </div>
              </div>

              {watch("previousBankruptcy") && (
                <div className="flex flex-col">
                  <Label htmlFor="bankruptcyDate" className="font-medium">
                    Bankruptcy Date
                  </Label>
                  <Input
                    id="bankruptcyDate"
                    type="date"
                    {...register("bankruptcyDate")}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <Label className="font-medium mb-2">Previous Business?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="previousBusiness"
                    onCheckedChange={(checked) => {
                      setValue("previousBusiness", checked as boolean);
                    }}
                  />
                  <Label htmlFor="previousBusiness">Yes</Label>
                </div>
              </div>

              {watch("previousBusiness") && (
                <div className="flex flex-col">
                  <Label
                    htmlFor="previousBusinessDetails"
                    className="font-medium"
                  >
                    Previous Business Details
                  </Label>
                  <Input
                    id="previousBusinessDetails"
                    {...register("previousBusinessDetails")}
                    placeholder="Enter previous business details"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* 3. Partner Information */}
          <SectionCard
            icon={User}
            title="Partner Information"
            description="Details about your business partner (if any)"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="partnerName" className="font-medium">
                  Partner Name
                </Label>
                <Input
                  id="partnerName"
                  {...register("partnerName")}
                  placeholder="Enter partner name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="partnerCreditScore"
                  className="font-medium"
                >
                  Credit Score
                </Label>
                <Input
                  id="partnerCreditScore"
                  {...register("partnerCreditScore")}
                  placeholder="Enter credit score"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="partnerDriversLicense"
                  className="font-medium"
                >
                  Driver's License Number
                </Label>
                <Input
                  id="partnerDriversLicense"
                  {...register("partnerDriversLicense")}
                  placeholder="Enter driver's license number"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="partnerDriversLicenseState"
                  className="font-medium"
                >
                  License State
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("partnerDriversLicenseState", value)
                  }
                  defaultValue="CA"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="partnerDriversLicenseExpiry"
                  className="font-medium"
                >
                  License Expiry Date
                </Label>
                <Input
                  id="partnerDriversLicenseExpiry"
                  type="date"
                  {...register("partnerDriversLicenseExpiry")}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label className="font-medium mb-2">
                  Previous Bankruptcy?
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partnerPreviousBankruptcy"
                    onCheckedChange={(checked) => {
                      setValue("partnerPreviousBankruptcy", checked as boolean);
                    }}
                  />
                  <Label htmlFor="partnerPreviousBankruptcy">Yes</Label>
                </div>
              </div>

              {watch("partnerPreviousBankruptcy") && (
                <div className="flex flex-col">
                  <Label
                    htmlFor="partnerBankruptcyDate"
                    className="font-medium"
                  >
                    Bankruptcy Date
                  </Label>
                  <Input
                    id="partnerBankruptcyDate"
                    type="date"
                    {...register("partnerBankruptcyDate")}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* 4. Banking Information */}
          <SectionCard
            icon={Landmark}
            title="Banking Information"
            description="Details about your business banking relationship"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="bankName" className="font-medium">
                  Bank Name *
                </Label>
                <Input
                  id="bankName"
                  {...register("bankName", { required: true })}
                  placeholder="Enter bank name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="bankAccountNumber"
                  className="font-medium"
                >
                  Account Number *
                </Label>
                <Input
                  id="bankAccountNumber"
                  {...register("bankAccountNumber", { required: true })}
                  placeholder="Enter account number"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="bankRoutingNumber"
                  className="font-medium"
                >
                  Routing Number *
                </Label>
                <Input
                  id="bankRoutingNumber"
                  {...register("bankRoutingNumber", { required: true })}
                  placeholder="Enter routing number"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="bankAccountType" className="font-medium">
                  Account Type *
                </Label>
                <Select
                  onValueChange={(value) => setValue("bankAccountType", value)}
                  defaultValue="checking"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="bankAccountOpenDate"
                  className="font-medium"
                >
                  Account Open Date *
                </Label>
                <Input
                  id="bankAccountOpenDate"
                  type="date"
                  {...register("bankAccountOpenDate", { required: true })}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="averageBalance" className="font-medium">
                  Average Balance *
                </Label>
                <Input
                  id="averageBalance"
                  {...register("averageBalance", { required: true })}
                  placeholder="Enter average balance"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="numberOfNSF" className="font-medium">
                  Number of NSF (Last 12 Months) *
                </Label>
                <Input
                  id="numberOfNSF"
                  {...register("numberOfNSF", { required: true })}
                  placeholder="Enter number of NSF"
                  className="mt-1"
                />
              </div>
            </div>
          </SectionCard>

          {/* 5. Outstanding Loans */}
          <SectionCard
            icon={DollarSign}
            title="Outstanding Loans"
            description="List any current business loans"
          >
            <div className="flex justify-end mb-3">
              <Button
                type="button"
                onClick={addLoan}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Loan</span>
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 bg-gray-50 mb-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Loan #{index + 1}
                  </h3>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <Label
                      htmlFor={`outstandingLoans.${index}.businessName`}
                      className="font-medium"
                    >
                      Business Name
                    </Label>
                    <Input
                      {...register(
                        `outstandingLoans.${index}.businessName` as const,
                        { required: true }
                      )}
                      placeholder="Enter business name"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`outstandingLoans.${index}.amountFunded`}
                      className="font-medium"
                    >
                      Amount Funded
                    </Label>
                    <Input
                      {...register(
                        `outstandingLoans.${index}.amountFunded` as const,
                        { required: true }
                      )}
                      placeholder="Enter funded amount"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`outstandingLoans.${index}.currentBalance`}
                      className="font-medium"
                    >
                      Current Balance
                    </Label>
                    <Input
                      {...register(
                        `outstandingLoans.${index}.currentBalance` as const,
                        { required: true }
                      )}
                      placeholder="Enter current balance"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`outstandingLoans.${index}.startDate`}
                      className="font-medium"
                    >
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      {...register(
                        `outstandingLoans.${index}.startDate` as const,
                        { required: true }
                      )}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`outstandingLoans.${index}.monthlyPayment`}
                      className="font-medium"
                    >
                      Monthly Payment
                    </Label>
                    <Input
                      {...register(
                        `outstandingLoans.${index}.monthlyPayment` as const,
                        { required: true }
                      )}
                      placeholder="Enter monthly payment"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>

          {/* 6. Business Property Information */}
          <SectionCard
            icon={Home}
            title="Business Property Information"
            description="Information about your business property"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label
                  htmlFor="businessPropertyInfo.landlordName"
                  className="font-medium"
                >
                  Business Landlord or Mortgage Bank *
                </Label>
                <Input
                  {...register("businessPropertyInfo.landlordName", {
                    required: true,
                  })}
                  placeholder="Enter landlord or bank name"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="businessPropertyInfo.monthlyRent"
                  className="font-medium"
                >
                  Monthly Rent *
                </Label>
                <Input
                  {...register("businessPropertyInfo.monthlyRent", {
                    required: true,
                  })}
                  placeholder="Enter monthly rent"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="businessPropertyInfo.leaseStartDate"
                  className="font-medium"
                >
                  Lease Start Date *
                </Label>
                <Input
                  type="date"
                  {...register("businessPropertyInfo.leaseStartDate", {
                    required: true,
                  })}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="businessPropertyInfo.leaseEndDate"
                  className="font-medium"
                >
                  Lease End Date *
                </Label>
                <Input
                  type="date"
                  {...register("businessPropertyInfo.leaseEndDate", {
                    required: true,
                  })}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="businessPropertyInfo.squareFootage"
                  className="font-medium"
                >
                  Square Footage *
                </Label>
                <Input
                  {...register("businessPropertyInfo.squareFootage", {
                    required: true,
                  })}
                  placeholder="Enter square footage"
                  className="mt-1"
                />
              </div>
            </div>
          </SectionCard>

          {/* 7. Business Trade References */}
          <SectionCard
            icon={ClipboardList}
            title="Business Trade References"
            description="Please list any trade references"
          >
            <div className="flex justify-end mb-3">
              <Button
                type="button"
                onClick={addTradeReference}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Reference</span>
              </Button>
            </div>

            {tradeRefFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 bg-gray-50 mb-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Reference #{index + 1}
                  </h3>
                  <Button
                    type="button"
                    onClick={() => removeTradeRef(index)}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <Label
                      htmlFor={`businessTradeReferences.${index}.businessName`}
                      className="font-medium"
                    >
                      Business Name
                    </Label>
                    <Input
                      {...register(
                        `businessTradeReferences.${index}.businessName` as const,
                        { required: true }
                      )}
                      placeholder="Enter business name"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`businessTradeReferences.${index}.relationship`}
                      className="font-medium"
                    >
                      Relationship
                    </Label>
                    <Input
                      {...register(
                        `businessTradeReferences.${index}.relationship` as const,
                        { required: true }
                      )}
                      placeholder="Enter relationship"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor={`businessTradeReferences.${index}.yearsKnown`}
                      className="font-medium"
                    >
                      Years Known
                    </Label>
                    <Input
                      {...register(
                        `businessTradeReferences.${index}.yearsKnown` as const,
                        { required: true }
                      )}
                      placeholder="Enter years known"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>

          {/* 8. Processing Information */}
          <SectionCard
            icon={CreditCard}
            title="Processing Information"
            description="Details about your payment processing"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label
                  htmlFor="currentProcessor"
                  className="font-medium"
                >
                  Current Processor *
                </Label>
                <Input
                  {...register("currentProcessor", { required: true })}
                  placeholder="Enter current processor"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="monthlyProcessingVolume"
                  className="font-medium"
                >
                  Monthly Processing Volume *
                </Label>
                <Input
                  {...register("monthlyProcessingVolume", { required: true })}
                  placeholder="Enter monthly volume"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="averageTicket" className="font-medium">
                  Average Ticket Size *
                </Label>
                <Input
                  {...register("averageTicket", { required: true })}
                  placeholder="Enter average ticket"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="terminalType" className="font-medium">
                  Terminal Type *
                </Label>
                <Input
                  {...register("terminalType", { required: true })}
                  placeholder="Enter terminal type"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="cardPresentPercentage" className="font-medium">
                  Card Present % *
                </Label>
                <Input
                  {...register("cardPresentPercentage", { required: true })}
                  placeholder="Enter percentage"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="ecommercePercentage" className="font-medium">
                  E-commerce % *
                </Label>
                <Input
                  {...register("ecommercePercentage", { required: true })}
                  placeholder="Enter percentage"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="mailOrderPercentage"
                  className="font-medium"
                >
                  Mail Order % *
                </Label>
                <Input
                  {...register("mailOrderPercentage", { required: true })}
                  placeholder="Enter percentage"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="b2bPercentage" className="font-medium">
                  B2B % *
                </Label>
                <Input
                  {...register("b2bPercentage", { required: true })}
                  placeholder="Enter percentage"
                  className="mt-1"
                />
              </div>
            </div>
          </SectionCard>

          {/* 9. Additional Fields / Authorization */}
          <SectionCard
            icon={PenTool}
            title="Additional Information"
            description="Final details and authorization"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="requestedAmount" className="font-medium">
                  Requested Amount *
                </Label>
                <Input
                  {...register("requestedAmount", { required: true })}
                  placeholder="Enter requested amount"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="fundingPurpose" className="font-medium">
                  Purpose of Funding *
                </Label>
                <Input
                  {...register("fundingPurpose", { required: true })}
                  placeholder="Enter funding purpose"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="preferredContactMethod"
                  className="font-medium"
                >
                  Preferred Contact Method *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("preferredContactMethod", value)
                  }
                  defaultValue="email"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="bestTimeToContact" className="font-medium">
                  Best Time to Contact *
                </Label>
                <Select
                  onValueChange={(value) => setValue("bestTimeToContact", value)}
                  defaultValue="morning"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="additionalComments" className="font-medium">
                  Additional Comments
                </Label>
                <Input
                  {...register("additionalComments")}
                  placeholder="Enter any additional comments"
                  className="mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="signature" className="font-medium">
                  Digital Signature *
                </Label>
                <Input
                  {...register("signature", { required: true })}
                  placeholder="Type your full legal name to sign"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-700">
                By signing above, you authorize the company, its assigns, agents, banks
                or financial institutions to obtain an investigative or consumer report
                from a credit bureau or a credit agency and to investigate the references
                given or any other statement or data obtained from you.
              </p>
            </div>
          </SectionCard>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>

          {/* Submission Status */}
          {submitStatus.type && (
            <motion.div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {submitStatus.message}
            </motion.div>
          )}
        </form>

        {/* Hidden PDF template for generating/downloading the PDF */}
        <PDFTemplate ref={pdfTemplateRef} data={watch()} />
      </div>
    </div>
  );
}
