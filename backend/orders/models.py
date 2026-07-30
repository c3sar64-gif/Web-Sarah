from django.conf import settings
from django.db import models

from products.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        PAID = 'paid', 'Pagado'
        SHIPPED = 'shipped', 'Enviado'
        CANCELLED = 'cancelled', 'Cancelado'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders'
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.pk} ({self.status})'

    def recalculate_total(self):
        self.total = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=['total'])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'
