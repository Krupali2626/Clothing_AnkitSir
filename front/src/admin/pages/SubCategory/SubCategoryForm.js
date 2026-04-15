import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdClose, MdSave, MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';

const SubCategoryForm = ({ initialValues, onSubmit, onCancel, isLoading }) => {
  const [preview, setPreview] = useState(null);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    if (initialValues?.subCategoryImage) {
      setPreview(initialValues.subCategoryImage.startsWith('http') ? initialValues.subCategoryImage : `http://localhost:8000/${initialValues.subCategoryImage}`);
    } else {
      setPreview(null);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: {
      subCategoryName: initialValues?.subCategoryName || '',
      categoryId: initialValues?.categoryId?._id || initialValues?.categoryId || '',
      subCategoryImage: null
    },
    validationSchema: Yup.object({
      subCategoryName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Sub category name is required'),
      categoryId: Yup.string().required('Category is required'),
      subCategoryImage: Yup.mixed().nullable()
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('subCategoryImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-xl w-full mx-auto">
      <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight">
            {initialValues ? 'Edit Sub Category' : 'Create New Sub Category'}
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Admin Studio</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2.5 hover:bg-white rounded-2xl text-slate-400 hover:text-black transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
        >
          <MdClose size={20} />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Sub Category Image</label>
          <div className="relative group">
            <div className={`w-full h-56 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-slate-50 ${preview ? 'border-black' : 'border-slate-200 hover:border-black'}`}>
              {preview ? (
                <div className="relative w-full h-full group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        formik.setFieldValue('subCategoryImage', null);
                      }}
                      className="bg-white text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <MdCloudUpload size={24} className="text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Drop your image here</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">PNG, JPG or WebP up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="subCategoryImage"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="subCategoryName" className="text-sm font-bold text-slate-700 ml-1">
              Sub Category Name
            </label>
            <input
              id="subCategoryName"
              name="subCategoryName"
              type="text"
              placeholder="e.g. Casual Shirts"
              className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none text-sm font-medium ${
                formik.touched.subCategoryName && formik.errors.subCategoryName
                  ? 'border-red-300 focus:border-red-500 bg-red-50/10'
                  : 'border-slate-200 focus:border-black focus:ring-4 focus:ring-black/5'
              }`}
              {...formik.getFieldProps('subCategoryName')}
            />
            {formik.touched.subCategoryName && formik.errors.subCategoryName && (
              <p className="text-xs font-bold text-red-500 ml-1 mt-1">{formik.errors.subCategoryName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="categoryId" className="text-sm font-bold text-slate-700 ml-1">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none text-sm font-medium ${
                formik.touched.categoryId && formik.errors.categoryId
                  ? 'border-red-300 focus:border-red-500 bg-red-50/10'
                  : 'border-slate-200 focus:border-black focus:ring-4 focus:ring-black/5'
              }`}
              {...formik.getFieldProps('categoryId')}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-xs font-bold text-red-500 ml-1 mt-1">{formik.errors.categoryId}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:text-black transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className="flex-[2] px-6 py-3.5 bg-black hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black rounded-2xl shadow-2xl shadow-black/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              <MdSave size={20} />
            )}
            {initialValues ? 'Save Changes' : 'Create Sub Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryForm;
