from django.db import models
from django.conf import settings

class Doctor(models.Model):
    SPECIALIZATION_CHOICES = (
        ('general', 'General Practitioner'),
        ('cardiology', 'Cardiologist'),
        ('dermatology', 'Dermatologist'),
        ('neurology', 'Neurologist'),
        ('orthopedics', 'Orthopedic Surgeon'),
        ('pediatrics', 'Pediatrician'),
        ('psychiatry', 'Psychiatrist'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=20, choices=SPECIALIZATION_CHOICES)
    hospital = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    email = models.EmailField()
    is_available_for_emergency = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Dr. {self.name} ({self.get_specialization_display()})"

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField()
    is_emergency = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} with Dr. {self.doctor.name} on {self.date}"