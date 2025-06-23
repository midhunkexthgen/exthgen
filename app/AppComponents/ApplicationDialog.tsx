import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdAttach } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import application from "../../public/illustration.png";


interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileInfo {
  name: string;
  size: number;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  file: string;
  consent: string;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Increased to 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        {type === 'success' ? (
          <FiCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
        ) : (
          <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        )}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className={`ml-2 ${
            type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
          }`}
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ApplicationDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
    file: "",
    consent: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: "",
    type: 'success',
    isVisible: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Reset toast when dialog opens
      hideToast();
    } else {
      // Reset toast when dialog closes
      hideToast();
    }
  }, [isOpen]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleClose = () => {
    setIsAnimating(false);
    hideToast(); // Hide toast when closing dialog
    setTimeout(() => {
      onClose();
      // Reset all states when dialog fully closes
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setConsentChecked(false);
    setSelectedFile(null);
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      file: "",
      consent: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      name: "",
      email: "",
      phone: "",
      file: "",
      consent: "",
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "First Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = "First Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // File validation
    if (!selectedFile) {
      errors.file = "Please attach a file";
      isValid = false;
    }

    // Consent validation
    if (!consentChecked) {
      errors.consent = "You must accept the privacy policy to continue";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormErrors(prev => ({ ...prev, file: "" }));

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, file: "File size must be less than 5MB" }));
        resetFileInput();
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];

      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, file: "File type not supported. Please upload PDF, DOC, DOCX, PNG, or JPEG files only" }));
        resetFileInput();
        return;
      }

      setSelectedFile({
        name: file.name,
        size: file.size,
      });
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
  };

  const handleFileRemove = () => {
    resetFileInput();
    setFormErrors(prev => ({ ...prev, file: "" }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const uploadToStrapi = async (file: File) => {
    const form = new FormData();
    form.append("files", file);

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error("File upload failed");
    }

    const data = await res.json();
    return data[0]; // the uploaded file object
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!fileInputRef.current?.files?.[0]) {
        setFormErrors(prev => ({ ...prev, file: "Please attach a file" }));
        setIsSubmitting(false);
        return;
      }

      const uploadedFile = await uploadToStrapi(fileInputRef.current.files[0]);
      console.log("Uploaded file:", uploadedFile);

      // Optional: send form data + file reference to a custom content type
      await fetch(`${baseUrl}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            file: uploadedFile.id, 
          },
        }),
      });

      // Show success toast first, then close dialog after a delay
      showToast("Application submitted successfully!", "success");
      
      // Reset form
      resetForm();
      
      // Close dialog after showing toast
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading:", error);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isAnimating
            ? "animate-in fade-in duration-300"
            : "animate-out fade-out duration-300"
        }`}
      >
        <div className="fixed inset-0 bg-black/40" onClick={handleClose} />

        <div
          className={`relative w-full max-w-lg bg-white rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto ${
            isAnimating
              ? "animate-in zoom-in-95 duration-300"
              : "animate-out zoom-out-95 duration-300"
          }`}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <AiOutlineClose className="text-gray-700 text-2xl border border-gray-700 rounded-full p-1" />
          </button>

          {/* Dialog content */}
          <div className="py-6 px-9 space-y-4">
            <div className="flex justify-center">
              <Image
                src={application}
                alt="Application"
                className="h-48 object-contain"
                height={0}
                width={0}
              />
            </div>
            <h2 className="text-2xl text-center text-gray-900 font-hedvig-serif">
              We See You, Not Your CV!
            </h2>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="First Name*"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2 rounded-3xl border ${
                    formErrors.name 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-300 focus:ring-pink-300'
                  } placeholder:font-light placeholder:text-sm focus:outline-none focus:ring-1`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1 pl-4">{formErrors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="E-Mail*"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 rounded-3xl border ${
                    formErrors.email 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-300 focus:ring-pink-300'
                  } placeholder:font-light placeholder:text-sm focus:outline-none focus:ring-1`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1 pl-4">{formErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2 rounded-3xl border ${
                    formErrors.phone 
                      ? 'border-red-300 focus:ring-red-300' 
                      : 'border-gray-300 focus:ring-pink-300'
                  } placeholder:font-light placeholder:text-sm focus:outline-none focus:ring-1`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1 pl-4">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center space-x-1 font-extralight text-[16px] cursor-pointer hover:text-gray-800 ${
                    formErrors.file ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  <IoMdAttach className="text-2xl" />
                  <span>Add your Attachment*</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
                  className="hidden"
                />

                {selectedFile && (
                  <div className="ml-6 mt-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {formErrors.file && (
                  <p className="text-red-500 text-xs pl-6">{formErrors.file}</p>
                )}

                <div className="text-xs text-gray-500 font-extralight pl-6">
                  Max 5 MB (Type pdf, doc, png, jpeg, docx)
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => {
                      setConsentChecked(e.target.checked);
                      if (formErrors.consent) {
                        setFormErrors(prev => ({ ...prev, consent: "" }));
                      }
                    }}
                    className={`h-7 w-7 rounded border text-pink-500 checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500 ${
                      formErrors.consent ? 'border-red-300' : 'border-gray-100'
                    }`}
                  />
                  <label className="text-xs font-extralight text-gray-500">
                    I have read the privacy and policy and consent to the processing
                    of my data for the purpose of handling my enquiry*
                  </label>
                </div>
                {formErrors.consent && (
                  <p className="text-red-500 text-xs pl-9">{formErrors.consent}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-exthgen-gradient hover:from-pink-600 hover:to-orange-500'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'} 
                {!isSubmitting && <BsArrowRight className="text-lg" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default ApplicationDialog;