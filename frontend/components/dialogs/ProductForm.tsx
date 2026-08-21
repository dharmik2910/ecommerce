'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  IconX,
  IconLoader2,
  IconTrash,
  IconPencil,
  IconPlus,
  IconPackage,
  IconCurrencyRupee,
  IconPhoto,
  IconInfoCircle,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
} from '@tabler/icons-react';
import { api, Product } from '@/lib/api';
import { toast } from 'sonner';

type OptionType = {
  label: string;
  value: string;
};

export type ProductFormProps = {
  item?: Product;
  show: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onReset?: () => void;
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
  onDelete?: (data: any) => void;
  options?: {
    categories?: OptionType[];
    [key: string]: any;
  };
};

const initialData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  categoryId: '',
  material: '',
  color: '',
  dimensions: '',
  images: '',
  isFeatured: false,
  isActive: true,
};

export default function ProductForm({
  item,
  show,
  onOpen,
  onClose,
  onReset,
  onCreate,
  onUpdate,
  onDelete,
  options,
}: ProductFormProps) {
  const [form, setForm] = useState(initialData);
  const [initialFormState, setInitialFormState] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'media_specs'>('general');

  // Auto-generate slug from name if slug hasn't been manually edited
  const handleNameChange = (val: string) => {
    setForm((prev) => {
      const isAuto =
        !prev.slug ||
        prev.slug ===
        prev.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      const newSlug = isAuto
        ? val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        : prev.slug;
      return { ...prev, name: val, slug: newSlug };
    });
    if (fieldErrors.name) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        return next;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // 🔄 Fetch and populate form when opening in edit mode
  useEffect(() => {
    if (show) {
      setErrorMsg('');
      setFieldErrors({});
      setShowDeleteConfirm(false);
      setActiveTab('general');

      if (item?.id) {
        setLoading(true);
        api.get(`/products/${item.slug || item.id}`)
          .then((res) => {
            const data = res.data;
            const loaded = {
              name: data.name || '',
              slug: data.slug || '',
              description: data.description || '',
              price: data.price !== undefined && data.price !== null ? String(data.price) : '',
              compareAtPrice: data.compareAtPrice !== undefined && data.compareAtPrice !== null ? String(data.compareAtPrice) : '',
              stock: data.stock !== undefined && data.stock !== null ? String(data.stock) : '0',
              categoryId: data.category?.id || data.categoryId || '',
              material: data.material || '',
              color: data.color || '',
              dimensions: data.dimensions || '',
              images: Array.isArray(data.images) ? data.images.join(', ') : data.images || '',
              isFeatured: Boolean(data.isFeatured),
              isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
            };
            setForm(loaded);
            setInitialFormState(loaded);
          })
          .catch(() => {
            toast.error('Failed to load product details');
            onClose?.();
          })
          .finally(() => setLoading(false));
      } else {
        setForm(initialData);
        setInitialFormState(initialData);
      }

      onOpen?.();
    } else {
      setForm(initialData);
      setInitialFormState(initialData);
    }
  }, [show, item?.id]);

  // Compute dirty state
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialFormState);
  }, [form, initialFormState]);

  // Parse image previews
  const imagePreviews = useMemo(() => {
    if (!form.images) return [];
    return form.images
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'));
  }, [form.images]);

  // Step Validation logic
  const validateCurrentStep = (step: 'general' | 'pricing' | 'media_specs') => {
    const errors: Record<string, string> = {};
    if (step === 'general') {
      if (!form.name || !form.name.trim()) errors.name = 'Product name is required';
      if (!form.categoryId || !form.categoryId.trim()) errors.categoryId = 'Category is required';
      if (!form.description || !form.description.trim()) errors.description = 'Description is required';

      setFieldErrors((prev) => {
        const next = { ...prev, ...errors };
        if (!errors.name) delete next.name;
        if (!errors.categoryId) delete next.categoryId;
        if (!errors.description) delete next.description;
        return next;
      });
    } else if (step === 'pricing') {
      if (form.price === '' || form.price === undefined || isNaN(Number(form.price)) || Number(form.price) < 0) {
        errors.price = 'Price is required';
      } else if (Number(form.price) > 999999999.99) {
        errors.price = 'Price cannot exceed ₹99,99,99,999.99';
      }

      if (form.compareAtPrice === '' || form.compareAtPrice === undefined || isNaN(Number(form.compareAtPrice)) || Number(form.compareAtPrice) < 0) {
        errors.compareAtPrice = 'Original price is required';
      } else if (Number(form.compareAtPrice) > 999999999.99) {
        errors.compareAtPrice = 'Original price cannot exceed ₹99,99,99,999.99';
      }

      if (form.stock === '' || form.stock === undefined || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
        errors.stock = 'Stock quantity is required';
      } else if (Number(form.stock) > 1000000) {
        errors.stock = 'Stock cannot exceed 1,000,000 units';
      }

      setFieldErrors((prev) => {
        const next = { ...prev, ...errors };
        if (!errors.price) delete next.price;
        if (!errors.compareAtPrice) delete next.compareAtPrice;
        if (!errors.stock) delete next.stock;
        return next;
      });
    } else if (step === 'media_specs') {
      if (!form.images || !form.images.trim()) errors.images = 'At least one image URL is required';
      if (!form.material || !form.material.trim()) errors.material = 'Material is required';
      if (!form.color || !form.color.trim()) errors.color = 'Color is required';
      if (!form.dimensions || !form.dimensions.trim()) errors.dimensions = 'Dimensions are required';

      setFieldErrors((prev) => {
        const next = { ...prev, ...errors };
        if (!errors.images) delete next.images;
        if (!errors.material) delete next.material;
        if (!errors.color) delete next.color;
        if (!errors.dimensions) delete next.dimensions;
        return next;
      });
    }
    return Object.keys(errors).length === 0;
  };

  const validateAllSteps = () => {
    const errors: Record<string, string> = {};
    if (!form.name || !form.name.trim()) errors.name = 'Product name is required';
    if (!form.categoryId || !form.categoryId.trim()) errors.categoryId = 'Category is required';
    if (!form.description || !form.description.trim()) errors.description = 'Description is required';

    if (form.price === '' || form.price === undefined || isNaN(Number(form.price)) || Number(form.price) < 0) {
      errors.price = 'Price is required';
    } else if (Number(form.price) > 999999999.99) {
      errors.price = 'Price cannot exceed ₹99,99,99,999.99';
    }

    if (form.compareAtPrice === '' || form.compareAtPrice === undefined || isNaN(Number(form.compareAtPrice)) || Number(form.compareAtPrice) < 0) {
      errors.compareAtPrice = 'Original price is required';
    } else if (Number(form.compareAtPrice) > 999999999.99) {
      errors.compareAtPrice = 'Original price cannot exceed ₹99,99,99,999.99';
    }

    if (form.stock === '' || form.stock === undefined || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      errors.stock = 'Stock quantity is required';
    } else if (Number(form.stock) > 1000000) {
      errors.stock = 'Stock cannot exceed 1,000,000 units';
    }

    if (!form.images || !form.images.trim()) errors.images = 'At least one image URL is required';
    if (!form.material || !form.material.trim()) errors.material = 'Material is required';
    if (!form.color || !form.color.trim()) errors.color = 'Color is required';
    if (!form.dimensions || !form.dimensions.trim()) errors.dimensions = 'Dimensions are required';

    setFieldErrors(errors);

    if (errors.name || errors.categoryId || errors.description) {
      setActiveTab('general');
      toast.error('Please fill in all required text boxes in Basic Info');
      return false;
    }
    if (errors.price || errors.compareAtPrice || errors.stock) {
      setActiveTab('pricing');
      toast.error('Please fill in all required text boxes in Pricing & Inventory');
      return false;
    }
    if (errors.images || errors.material || errors.color || errors.dimensions) {
      setActiveTab('media_specs');
      toast.error('Please fill in all required text boxes in Media & Specs');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (activeTab === 'general') {
      if (validateCurrentStep('general')) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.price;
          delete next.compareAtPrice;
          delete next.stock;
          delete next.images;
          delete next.material;
          delete next.color;
          delete next.dimensions;
          return next;
        });
        setActiveTab('pricing');
      }
    } else if (activeTab === 'pricing') {
      if (validateCurrentStep('pricing')) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.images;
          delete next.material;
          delete next.color;
          delete next.dimensions;
          return next;
        });
        setActiveTab('media_specs');
      }
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'media_specs') {
      setActiveTab('pricing');
    } else if (activeTab === 'pricing') {
      setActiveTab('general');
    }
  };

  // Compute dirty state for current active step/tab
  const isStepDirty = useMemo(() => {
    if (activeTab === 'general') {
      return (
        form.name !== initialFormState.name ||
        form.categoryId !== initialFormState.categoryId ||
        form.description !== initialFormState.description
      );
    }
    if (activeTab === 'pricing') {
      return (
        form.price !== initialFormState.price ||
        form.compareAtPrice !== initialFormState.compareAtPrice ||
        form.stock !== initialFormState.stock
      );
    }
    if (activeTab === 'media_specs') {
      return (
        form.images !== initialFormState.images ||
        form.material !== initialFormState.material ||
        form.color !== initialFormState.color ||
        form.dimensions !== initialFormState.dimensions ||
        form.isFeatured !== initialFormState.isFeatured ||
        form.isActive !== initialFormState.isActive
      );
    }
    return false;
  }, [form, initialFormState, activeTab]);

  const handleResetClick = () => {
    if (activeTab === 'general') {
      setForm((prev) => ({
        ...prev,
        name: initialFormState.name,
        categoryId: initialFormState.categoryId,
        description: initialFormState.description,
      }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        delete next.categoryId;
        delete next.description;
        return next;
      });
    } else if (activeTab === 'pricing') {
      setForm((prev) => ({
        ...prev,
        price: initialFormState.price,
        compareAtPrice: initialFormState.compareAtPrice,
        stock: initialFormState.stock,
      }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.price;
        delete next.compareAtPrice;
        delete next.stock;
        return next;
      });
    } else if (activeTab === 'media_specs') {
      setForm((prev) => ({
        ...prev,
        images: initialFormState.images,
        material: initialFormState.material,
        color: initialFormState.color,
        dimensions: initialFormState.dimensions,
        isFeatured: initialFormState.isFeatured,
        isActive: initialFormState.isActive,
      }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        delete next.material;
        delete next.color;
        delete next.dimensions;
        return next;
      });
    }
  };

  const handleApiErrors = (err: any) => {
    const data = err?.response?.data;
    const errorList = data?.errors || (Array.isArray(data?.message) ? data.message : null);
    const newFieldErrors: Record<string, string> = {};

    if (Array.isArray(errorList)) {
      errorList.forEach((item: any) => {
        if (typeof item === 'object' && (item.field || item.path)) {
          const fieldName = item.field || item.path;
          newFieldErrors[fieldName] = item.message;
          if (fieldName === 'name' || fieldName === 'slug') setActiveTab('general');
          else if (fieldName === 'price' || fieldName === 'stock') setActiveTab('pricing');
        } else if (typeof item === 'string') {
          const lower = item.toLowerCase();
          if (lower.includes('slug')) { newFieldErrors.slug = item; setActiveTab('general'); }
          else if (lower.includes('name')) { newFieldErrors.name = item; setActiveTab('general'); }
          else if (lower.includes('price')) { newFieldErrors.price = item; setActiveTab('pricing'); }
          else if (lower.includes('stock')) { newFieldErrors.stock = item; setActiveTab('pricing'); }
        }
      });
    }

    const singleMsg = typeof data?.message === 'string' ? data.message : null;
    if (singleMsg) {
      if (singleMsg.toLowerCase().includes('slug')) {
        newFieldErrors.slug = singleMsg;
        setActiveTab('general');
      } else {
        setErrorMsg(singleMsg);
      }
    }

    setFieldErrors(newFieldErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllSteps()) {
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setFieldErrors({});

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      categoryId: form.categoryId || undefined,
      description: form.description || undefined,
      material: form.material || undefined,
      color: form.color || undefined,
      dimensions: form.dimensions || undefined,
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };

    try {
      if (item?.id) {
        const res = await api.patch(`/products/${item.id}`, payload);
        onUpdate?.(res.data);
        onClose?.();
      } else {
        const res = await api.post('/products', payload);
        onCreate?.(res.data);
        onClose?.();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message?.toString() || 'Could not save product.';
      handleApiErrors(err);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    setSubmitting(true);
    try {
      const res = await api.delete(`/products/${item.id}`);
      onDelete?.(res.data);
      onClose?.();
    } catch (err: any) {
      toast.error('Failed to delete product');
    } finally {
      setSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-opacity">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-walnut-200/80 bg-white shadow-2xl overflow-hidden">

        {/* HEADER BAR */}
        <div className="flex shrink-0 items-center justify-between border-b border-walnut-100 bg-linen-50/50 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-walnut-900 text-white shadow-sm">
              {item ? <IconPencil size={20} /> : <IconPlus size={20} />}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-walnut-950">
                {item ? `Edit Product` : 'Create Product'}
              </h2>
              <p className="text-xs font-medium text-walnut-500">
                {item ? item.name || `#${item.id}` : 'Step-by-step product creation wizard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {item && (
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${form.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${form.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {form.isActive ? 'Active' : 'Draft'}
              </span>
            )}
            <button
              onClick={onClose}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-walnut-400 hover:bg-walnut-100 hover:text-walnut-800 transition"
              aria-label="Close modal"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* STEPPER WIZARD TABS */}
        <div className="flex shrink-0 border-b border-walnut-100 bg-white px-4 sm:px-8 gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === 'general'
              ? 'border-walnut-900 text-walnut-950'
              : 'border-transparent text-walnut-500 hover:text-walnut-800'
              }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${activeTab === 'general' ? 'bg-walnut-900 text-white' : 'bg-walnut-100 text-walnut-700'
              }`}>1</span>
            <IconPackage size={16} />
            <span>Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateCurrentStep('general')) setActiveTab('pricing');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === 'pricing'
              ? 'border-walnut-900 text-walnut-950'
              : 'border-transparent text-walnut-500 hover:text-walnut-800'
              }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${activeTab === 'pricing' ? 'bg-walnut-900 text-white' : 'bg-walnut-100 text-walnut-700'
              }`}>2</span>
            <IconCurrencyRupee size={16} />
            <span>Pricing & Inventory</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateCurrentStep('general') && validateCurrentStep('pricing')) setActiveTab('media_specs');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === 'media_specs'
              ? 'border-walnut-900 text-walnut-950'
              : 'border-transparent text-walnut-500 hover:text-walnut-800'
              }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${activeTab === 'media_specs' ? 'bg-walnut-900 text-white' : 'bg-walnut-100 text-walnut-700'
              }`}>3</span>
            <IconPhoto size={16} />
            <span>Media & Specs</span>
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {item?.id && loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <IconLoader2 size={40} className="animate-spin text-walnut-700" />
              <p className="text-sm font-medium text-walnut-600">Fetching product details...</p>
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">

              {/* STEP 1: BASIC INFO */}
              {activeTab === 'general' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-walnut-100 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-walnut-900">Step 1: Product Information</h3>
                    <span className="text-xs text-walnut-500">Fill in title and slug to proceed</span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Product Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        autoFocus
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                        placeholder="e.g. Windsor Dining Chair"
                      />
                      {fieldErrors.name && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.categoryId ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                      >
                        <option value="">— Select Category —</option>
                        {options?.categories?.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.categoryId && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.categoryId}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                        }`}
                      placeholder="Write a clear, detailed description of the product..."
                    />
                    {fieldErrors.description && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.description}</p>}
                  </div>
                </div>
              )}

              {/* STEP 2: PRICING & INVENTORY */}
              {activeTab === 'pricing' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-walnut-100 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-walnut-900">Step 2: Pricing & Stock</h3>
                    <span className="text-xs text-walnut-500">Set prices and inventory count</span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-walnut-400 font-medium">₹</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          className={`w-full rounded-lg border pl-8 pr-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.price ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                            }`}
                          placeholder="2499"
                        />
                      </div>
                      {fieldErrors.price && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.price}</p>}
                    </div>

                    {/* Compare At Price */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Original Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-walnut-400 font-medium">₹</span>
                        <input
                          name="compareAtPrice"
                          type="number"
                          step="0.01"
                          value={form.compareAtPrice}
                          onChange={handleChange}
                          className={`w-full rounded-lg border pl-8 pr-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.compareAtPrice ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                            }`}
                          placeholder="2999"
                        />
                      </div>
                      {fieldErrors.compareAtPrice && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.compareAtPrice}</p>}
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Stock Quantity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="stock"
                        type="number"
                        value={form.stock}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.stock ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                        placeholder="10"
                      />
                      {fieldErrors.stock && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.stock}</p>}
                    </div>
                  </div>

                  {/* Stock Notice */}
                  <div className="rounded-xl border border-walnut-100 bg-linen-50/60 p-4 flex items-center gap-3">
                    <IconInfoCircle size={20} className="text-walnut-600 shrink-0" />
                    <p className="text-xs text-walnut-700 leading-relaxed">
                      Items with stock set to <span className="font-semibold text-walnut-950">0</span> automatically display as <strong>Out of Stock</strong> on the store catalog.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIA & SPECIFICATIONS */}
              {activeTab === 'media_specs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-walnut-100 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-walnut-900">Step 3: Media & Specifications</h3>
                    <span className="text-xs text-walnut-500">Finalize imagery and features</span>
                  </div>

                  {/* Image URLs */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                      Image URLs (comma separated) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="images"
                      value={form.images}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-walnut-950 shadow-2xs outline-none transition focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 ${fieldErrors.images ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                        }`}
                      placeholder="https://images.unsplash.com/..., https://..."
                    />
                    {fieldErrors.images && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.images}</p>}
                  </div>

                  {/* Thumbnails */}
                  {imagePreviews.length > 0 && (
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-2">
                        Image Previews ({imagePreviews.length})
                      </span>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {imagePreviews.map((url, idx) => (
                          <div key={idx} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-walnut-200 bg-walnut-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Preview ${idx + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="border-walnut-100" />

                  {/* Specifications */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Material <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-walnut-950 outline-none transition focus:border-walnut-900 ${fieldErrors.material ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                        placeholder="e.g. Solid Oak"
                      />
                      {fieldErrors.material && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.material}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Color <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-walnut-950 outline-none transition focus:border-walnut-900 ${fieldErrors.color ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                        placeholder="e.g. Natural Wood"
                      />
                      {fieldErrors.color && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.color}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                        Dimensions <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="dimensions"
                        value={form.dimensions}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3.5 py-2 text-sm text-walnut-950 outline-none transition focus:border-walnut-900 ${fieldErrors.dimensions ? 'border-rose-400 bg-rose-50/30' : 'border-walnut-200 bg-white'
                          }`}
                        placeholder="e.g. 45 x 50 x 90 cm"
                      />
                      {fieldErrors.dimensions && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.dimensions}</p>}
                    </div>
                  </div>

                  <hr className="border-walnut-100" />

                  {/* Status Switches */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-walnut-200 bg-white p-4 transition hover:border-walnut-300">
                      <div>
                        <p className="text-sm font-semibold text-walnut-950">Featured Product</p>
                        <p className="text-xs text-walnut-500">Highlight on home & catalog page</p>
                      </div>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-walnut-300 text-walnut-900 accent-walnut-900"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-walnut-200 bg-white p-4 transition hover:border-walnut-300">
                      <div>
                        <p className="text-sm font-semibold text-walnut-950">Active Status</p>
                        <p className="text-xs text-walnut-500">Visible to online store visitors</p>
                      </div>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-walnut-300 text-walnut-900 accent-walnut-900"
                      />
                    </label>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div className="flex shrink-0 items-center justify-between border-t border-walnut-100 bg-linen-50/50 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            {item?.id && (
              <button
                type="button"
                onClick={() => {
                  if (item?.id) onDelete?.(item.id);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 shadow-2xs hover:bg-rose-50 hover:border-rose-300 transition"
              >
                <IconTrash size={15} />
                <span>Delete</span>
              </button>
            )}

            {activeTab !== 'general' && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 rounded-lg border border-walnut-200 bg-white px-4 py-2 text-xs font-semibold text-walnut-700 shadow-2xs hover:bg-walnut-50 transition"
              >
                <IconArrowLeft size={15} />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!isStepDirty || submitting}
              onClick={handleResetClick}
              className="rounded-lg border border-walnut-200 bg-white px-5 py-2.5 text-xs font-semibold text-walnut-700 shadow-2xs hover:bg-walnut-50 disabled:opacity-40 transition"
            >
              Reset
            </button>

            {activeTab !== 'media_specs' ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-walnut-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-walnut-800"
              >
                <span>Next</span>
                <IconArrowRight size={15} />
              </button>
            ) : (
              <button
                type="submit"
                form="product-form"
                disabled={submitting || (item?.id ? !isDirty : false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-walnut-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-walnut-800 disabled:opacity-50"
              >
                {submitting && <IconLoader2 size={16} className="animate-spin" />}
                <span>{submitting ? (item?.id ? 'Updating...' : 'Creating...') : (item?.id ? 'Save Changes' : 'Create Product')}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
