"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createOrganization } from "@/repository/organization.repository";
import { getFromLocalStorage, updateLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent, ReactNode } from "react";
import { FaMapMarkerAlt, FaRegBuilding, FaUpload } from "react-icons/fa";
import Image from "next/image";

const AREAS_OF_OPERATION = [
  "Disaster Response",
  "Health & Medical",
  "Food Security & Nutrition",
  "Shelter & Housing",
  "Water, Sanitation & Hygiene (WASH)",
  "Education",
  "Protection & Human Rights",
  "Livelihoods & Economic Recovery",
  "Logistics & Supply Chain",
  "Camp Coordination & Management",
  "Environment & Climate Action",
  "Child Protection",
  "Gender-Based Violence (GBV)",
  "Migration & Refugee Assistance",
  "Community Development",
  "Peacebuilding & Conflict Resolution",
  "Advocacy & Policy"
];

const CreateOrganization = (): ReactNode => {
  const router = useRouter();
  const { toast } = useToast();
  const dict = useDictionary();

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev: string[]) =>
      prev.includes(area)
        ? prev.filter((a: string) => a !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData: FormData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        addressLine1: formData.get("addressLine1") as string,
        addressLine2: formData.get("addressLine2") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string,
        state: formData.get("state") as string,
        country: formData.get("country") as string,
      };

      const { data: responseData } = await createOrganization({
        name: data.name,
        description: data.description,
        areas_of_operation: selectedAreas,
        logo: logoPreview,
        address: {
          address_line_1: data.addressLine1,
          address_line_2: data.addressLine2,
          city: data.city,
          zip_code: data.postalCode,
          district: data.state,
          country: data.country,
        },
      });

      const organizationID = responseData.id;

      const currentUser = await getFromLocalStorage("r_ud");
      await updateLocalStorage("r_ud", {
        ...currentUser,
        platform_role: "ORG_ADMIN",
        organization_id: organizationID,
      });

      router.push(`/app/${organizationID}`);
    } catch {
      setIsLoading(false);
      toast({
        title: dict.createOrganization.toastErrorTitle,
        description: dict.createOrganization.description,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-100px)] w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 py-10">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-lg">
        <header className="bg-relif-orange-200 text-white py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FaRegBuilding size={32} />
            <span className="font-bold text-2xl">{dict.createOrganization.title}</span>
          </div>
        </header>
        <form
          className="flex flex-col gap-8 p-8 overflow-y-auto max-h-[60vh]"
          onSubmit={handleSubmit}
        >
          {/* Logo upload section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-2 w-full max-w-[120px]">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-relif-orange-200 bg-slate-50 flex items-center justify-center">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FaRegBuilding size={48} className="text-slate-300" />
                )}
              </div>
              <Label
                htmlFor="logo"
                className="mt-2 flex cursor-pointer text-sm items-center gap-1 text-relif-orange-200 hover:underline"
              >
                <FaUpload /> Upload Logo
              </Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{dict.createOrganization.name} *</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  className="border border-slate-200 rounded-md p-2 focus:outline-relif-orange-200 resize-none"
                  placeholder="Describe your organization..."
                />
              </div>
            </div>
          </div>
          {/* Areas of operation */}
          <div className="flex flex-col gap-3">
            <Label className="mb-1">Areas of Operation *</Label>
            <div className="flex flex-wrap gap-2">
              {AREAS_OF_OPERATION.map((area) => (
                <button
                  key={area}
                  type="button"
                  className={`px-3 py-1 mb-1 rounded-full border text-sm transition font-medium ${
                    selectedAreas.includes(area)
                      ? "bg-relif-orange-200 text-white border-relif-orange-200 shadow"
                      : "bg-white text-relif-orange-200 border-relif-orange-200 hover:bg-relif-orange-100"
                  }`}
                  onClick={() => handleAreaToggle(area)}
                  aria-pressed={selectedAreas.includes(area)}
                >
                  {area}
                </button>
              ))}
            </div>
            {selectedAreas.length === 0 && (
              <span className="text-xs text-red-500 mt-1">Please select at least one area.</span>
            )}
          </div>
          {/* Address section */}
          <div className="w-full flex flex-col gap-4 p-6 border border-dashed border-relif-orange-200 rounded-lg bg-slate-50">
            <h2 className="text-relif-orange-200 font-bold flex items-center gap-2 text-lg mb-2">
              <FaMapMarkerAlt /> {dict.createOrganization.address}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="addressLine1">{dict.createOrganization.addressLine} 1 *</Label>
                <Input id="addressLine1" name="addressLine1" type="text" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="addressLine2">{dict.createOrganization.addressLine} 2</Label>
                <Input id="addressLine2" name="addressLine2" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="city">{dict.createOrganization.city} *</Label>
                <Input id="city" name="city" type="text" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="postalCode">{dict.createOrganization.postalCode} *</Label>
                <Input id="postalCode" name="postalCode" type="text" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="state">{dict.createOrganization.state} *</Label>
                <Input id="state" name="state" type="text" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="country">{dict.createOrganization.country} *</Label>
                <Input id="country" name="country" type="text" required />
              </div>
            </div>
          </div>
          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || selectedAreas.length === 0}
              className="px-8 py-2 text-lg font-semibold"
            >
              {isLoading ? dict.loading : dict.createOrganization.submit}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateOrganization;
