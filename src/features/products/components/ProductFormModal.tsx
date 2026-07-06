import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useCreateProduct, useUpdateProduct } from '@/features/products/hooks/useProducts';
import type { Product } from '@/shared/types/api.types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.number().min(0, 'Must be positive'),
  sellingPrice: z.number().min(0, 'Must be positive'),
  stock: z.number().int().min(0, 'Must be 0 or more'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isEdit = !!product;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', sku: '', category: '', purchasePrice: 0, sellingPrice: 0, stock: 0 },
  });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          sku: product.sku,
          category: product.category,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          stock: product.stock,
        });
        setPreview(product.imageUrl || '');
      } else {
        reset({ name: '', sku: '', category: '', purchasePrice: 0, sellingPrice: 0, stock: 0 });
        setPreview('');
      }
      setImageFile(null);
      setImageError('');
    }
  }, [open, product, reset]);

  useEffect(() => {
    if (!imageFile) {
      if (!product?.imageUrl) setPreview('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, product?.imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      setImageError('File must be an image');
      setImageFile(null);
      return;
    }
    setImageError('');
    setImageFile(file);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!isEdit && !imageFile) {
      setImageError('Product image is required');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, String(val)));
    if (imageFile) formData.append('image', imageFile);

    if (isEdit && product) {
      await updateMutation.mutateAsync({ id: product._id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    reset();
    setImageFile(null);
    setPreview('');
    setImageError('');
    onClose();
  };

  const pending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
        <Input label="Category" error={errors.category?.message} {...register('category')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Purchase Price" type="number" step="0.01" error={errors.purchasePrice?.message} {...register('purchasePrice', { valueAsNumber: true })} />
          <Input label="Selling Price" type="number" step="0.01" error={errors.sellingPrice?.message} {...register('sellingPrice', { valueAsNumber: true })} />
        </div>
        <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock', { valueAsNumber: true })} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Product Image {!isEdit && <span className="text-error-500">*</span>}
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-500 hover:border-brand-300 hover:bg-brand-50 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-800"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <Upload size={18} className="text-gray-400 shrink-0" />
            )}
            <span className="truncate">
              {imageFile ? imageFile.name : product?.imageUrl ? 'Change image' : 'Click to upload image'}
            </span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {imageError && <p className="mt-1 text-theme-xs text-error-500">{imageError}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" loading={pending}>{isEdit ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
