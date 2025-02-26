import React from 'react';
import { Upload, AlertCircle, FileCheck } from 'lucide-react';
import { CargoType } from '../../types/cargo';

interface CargoDocumentUploadProps {
  cargoType: CargoType;
  onFileUpload: (files: FileList) => void;
}

export function CargoDocumentUpload({ cargoType, onFileUpload }: CargoDocumentUploadProps) {
  const requiredDocuments = {
    general: [
      { name: 'Commercial Invoice', required: true },
      { name: 'Packing List', required: true },
      { name: 'Certificate of Origin', required: false },
      { name: 'Export/Import License', required: false },
      { name: 'Insurance Certificate', required: false }
    ],
    pharma: [
      { name: 'Commercial Invoice', required: true },
      { name: 'Packing List', required: true },
      { name: 'GDP Compliance Certificate', required: true },
      { name: 'Certificate of Analysis', required: true },
      { name: 'Temperature Log', required: true },
      { name: 'Import/Export Permits', required: false }
    ],
    perishable: [
      { name: 'Commercial Invoice', required: true },
      { name: 'Packing List', required: true },
      { name: 'Health Certificate', required: true },
      { name: 'Temperature Log', required: true },
      { name: 'Phytosanitary Certificate', required: true }
    ],
    dangerous: [
      { name: 'Commercial Invoice', required: true },
      { name: 'Packing List', required: true },
      { name: "Shipper's Declaration for Dangerous Goods", required: true },
      { name: 'Material Safety Data Sheet', required: true },
      { name: 'Dangerous Goods Packing Certificate', required: true }
    ],
    special: [
      { name: 'Commercial Invoice', required: true },
      { name: 'Packing List', required: true },
      { name: 'Insurance Certificate', required: true },
      { name: 'Special Handling Instructions', required: true },
      { name: 'Value Declaration', required: true }
    ]
  };

  const documents = requiredDocuments[cargoType] || requiredDocuments.general;
  const [uploadedFiles, setUploadedFiles] = React.useState<{ [key: string]: File | null }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, documentName: string) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [documentName]: files[0]
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <h3 className="font-medium text-sky-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-sky-500" />
          Required Documents for {cargoType.charAt(0).toUpperCase() + cargoType.slice(1)} Cargo
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.name} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                {doc.required && (
                  <span className="text-xs text-red-500">Required</span>
                )}
              </div>
              {uploadedFiles[doc.name] && (
                <FileCheck className="h-5 w-5 text-green-500" />
              )}
            </div>

            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, doc.name)}
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={doc.required}
              />
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                {uploadedFiles[doc.name] ? 'Replace file' : 'Upload file'}
              </div>
              {uploadedFiles[doc.name] && (
                <p className="mt-1 text-sm text-gray-500">
                  {uploadedFiles[doc.name]?.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}