from django.contrib import admin
from .models import Symptom, Disease, SymptomLog, Diagnosis

admin.site.register(Symptom)
admin.site.register(Disease)
admin.site.register(SymptomLog)
admin.site.register(Diagnosis)