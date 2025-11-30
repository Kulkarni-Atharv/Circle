import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductWithSeller } from '@/types'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface BuyNowDialogProps {
    product: ProductWithSeller
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BuyNowDialog({ product, open, onOpenChange }: BuyNowDialogProps) {
    const sellerName = product.seller?.name || 'Unknown Seller'
    const sellerPhone = product.seller?.phone || ''

    // Format phone for WhatsApp (remove non-digits)
    const whatsappNumber = sellerPhone.replace(/\D/g, '')

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Contact Seller</DialogTitle>
                    <DialogDescription>
                        Connect with the seller to purchase this item.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 py-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.images?.[0] && (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Seller: <span className="font-medium text-foreground">{sellerName}</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {sellerPhone && (
                        <Button className="w-full" asChild>
                            <a href={`tel:${sellerPhone}`}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call {sellerPhone}
                            </a>
                        </Button>
                    )}

                    {sellerPhone && (
                        <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in your product "${product.name}" listed on Mini-Marketplace.`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Chat on WhatsApp
                            </a>
                        </Button>
                    )}

                    <Button variant="outline" className="w-full" disabled>
                        <Mail className="mr-2 h-4 w-4" />
                        Email (Coming Soon)
                    </Button>
                </div>

                <div className="text-xs text-center text-muted-foreground mt-4">
                    <p>Mini-Marketplace does not handle payments directly.</p>
                    <p>Please arrange payment and delivery with the seller.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
