
import React from 'react';
import { Package, Tag, MapPin, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LikeDislike } from '@/components/ui/like-dislike';
import { UserTag } from '@/components/ui/user-tag';
import { cn } from '@/lib/utils';

const categoryColors = {
  food: 'bg-orange-100 text-orange-700',
  beverages: 'bg-blue-100 text-blue-700',
  household: 'bg-purple-100 text-purple-700',
  personal_care: 'bg-pink-100 text-pink-700',
  baby: 'bg-rose-100 text-rose-700',
  pet: 'bg-amber-100 text-amber-700',
  health: 'bg-red-100 text-red-700',
  frozen: 'bg-cyan-100 text-cyan-700',
  dairy: 'bg-yellow-100 text-yellow-700',
  produce: 'bg-green-100 text-green-700',
  meat: 'bg-red-100 text-red-700',
  bakery: 'bg-amber-100 text-amber-700',
  snacks: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function ProductCard({ 
  product, 
  latestPrice, 
  priceChange, 
  onClick,
  currentUserId,
  onLike,
  onDislike
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-sm text-slate-500">{product.brand}</p>
              )}
            </div>
            {latestPrice && (
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-slate-800">${latestPrice.price?.toFixed(2)}</p>
                {priceChange !== undefined && priceChange !== 0 && (
                  <div className={cn(
                    "flex items-center justify-end gap-1 text-xs",
                    priceChange < 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {priceChange < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    <span>{Math.abs(priceChange).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {product.category && (
              <Badge 
                variant="secondary" 
                className={cn("text-xs", categoryColors[product.category])}
              >
                {product.category.replace('_', ' ')}
              </Badge>
            )}
            {latestPrice?.store_name && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {latestPrice.store_name}
              </span>
            )}
          </div>

          {/* User Tag and Like/Dislike */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <UserTag 
              userId={product.created_by}
              userName={product.created_by_name}
              timestamp={product.created_date}
              size="small"
            />
            
            <div onClick={(e) => e.stopPropagation()}>
              <LikeDislike
                likes={product.likes || []}
                dislikes={product.dislikes || []}
                currentUserId={currentUserId}
                onLike={() => onLike && onLike(product)}
                onDislike={() => onDislike && onDislike(product)}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
