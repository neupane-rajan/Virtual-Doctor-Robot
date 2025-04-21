from django.db import models
from django.conf import settings

class Symptom(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    def __str__(self):
        return self.name

class Disease(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    symptoms = models.ManyToManyField(Symptom, related_name='diseases')
    
    def __str__(self):
        return self.name

class SymptomLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='symptom_logs')
    symptoms = models.ManyToManyField(Symptom)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d')}"

class Diagnosis(models.Model):
    symptom_log = models.OneToOneField(SymptomLog, on_delete=models.CASCADE, related_name='diagnosis')
    possible_diseases = models.ManyToManyField(Disease, related_name='diagnoses')
    recommendation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Diagnosis for {self.symptom_log.user.username}"