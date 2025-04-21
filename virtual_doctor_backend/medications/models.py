from django.db import models
from django.conf import settings

class Medication(models.Model):
    FREQUENCY_CHOICES = (
        ('daily', 'Daily'),
        ('twice_daily', 'Twice Daily'),
        ('three_times_daily', 'Three Times Daily'),
        ('four_times_daily', 'Four Times Daily'),
        ('weekly', 'Weekly'),
        ('as_needed', 'As Needed'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    instructions = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"

class MedicationLog(models.Model):
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='logs')
    taken_at = models.DateTimeField()
    taken = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.medication.name} - {self.taken_at}"