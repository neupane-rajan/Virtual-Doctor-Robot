from django.contrib import admin
from .models import Medication, MedicationLog

admin.site.register(Medication)
admin.site.register(MedicationLog)