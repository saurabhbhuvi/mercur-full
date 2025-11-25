import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import type { IProductModuleService } from "@medusajs/framework/types";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const categoryId = req.params.id;
  
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    
    // Get the category
    const category = await productModuleService.retrieveProductCategory(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Get images from request body
    const { images, thumbnail } = req.body as { images?: any[]; thumbnail?: string };
    
    // Update category metadata with images
    const metadata = category.metadata || {};
    const updatedCategory = await productModuleService.updateProductCategories(categoryId, {
      metadata: {
        ...metadata,
        images: images || (metadata.images as any[]) || [],
        thumbnail: thumbnail || (metadata.thumbnail as string) || null,
      }
    });
    
    res.json({ category: updatedCategory });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message || "Failed to upload images" 
    });
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const categoryId = req.params.id;
  
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    
    // Get the category
    const category = await productModuleService.retrieveProductCategory(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Get image IDs to delete from query params
    const { ids } = req.query;
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    
    // Update category metadata by removing specified images
    const metadata = category.metadata || {};
    const currentImages = (metadata.images as any[]) || [];
    const updatedImages = currentImages.filter((img: any) => 
      !idsToDelete.includes(img.id)
    );
    
    const updatedCategory = await productModuleService.updateProductCategories(categoryId, {
      metadata: {
        ...metadata,
        images: updatedImages,
      }
    });
    
    res.json({ category: updatedCategory });
  } catch (error: any) {
    res.status(400).json({ 
      message: error.message || "Failed to delete images" 
    });
  }
}
