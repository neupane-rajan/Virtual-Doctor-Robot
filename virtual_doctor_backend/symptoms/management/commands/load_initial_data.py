import json
from django.core.management.base import BaseCommand
from symptoms.models import Symptom, Disease
from appointments.models import Doctor

class Command(BaseCommand):
    help = 'Loads initial data for the Virtual Doctor Robot application'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data load...'))
        
        # Create symptoms
        symptoms_data = [
            {"name": "Fever", "description": "Body temperature above normal range (usually above 38°C or 100.4°F)"},
            {"name": "Cough", "description": "Sudden expulsion of air from the lungs to clear the air passages"},
            {"name": "Headache", "description": "Pain in any region of the head"},
            {"name": "Sore Throat", "description": "Pain, scratchiness or irritation of the throat that often worsens when swallowing"},
            {"name": "Fatigue", "description": "Extreme tiredness resulting from mental or physical exertion"},
            {"name": "Nausea", "description": "Feeling of sickness with an inclination to vomit"},
            {"name": "Dizziness", "description": "Feeling faint, lightheaded, or unsteady"},
            {"name": "Chest Pain", "description": "Pain or discomfort in the chest area"},
            {"name": "Shortness of Breath", "description": "Difficulty breathing or feeling that you can't get enough air"},
            {"name": "Runny Nose", "description": "Excessive discharge of clear nasal mucus"},
        ]
        
        for data in symptoms_data:
            symptom, created = Symptom.objects.get_or_create(
                name=data["name"],
                defaults={"description": data["description"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created symptom: {symptom.name}'))
        
        # Create diseases
        diseases_data = [
            {
                "name": "Common Cold",
                "description": "A viral infection of the upper respiratory tract",
                "symptoms": ["Runny Nose", "Sore Throat", "Cough", "Fever"]
            },
            {
                "name": "Influenza (Flu)",
                "description": "A contagious respiratory illness caused by influenza viruses",
                "symptoms": ["Fever", "Cough", "Fatigue", "Headache", "Sore Throat"]
            },
            {
                "name": "Migraine",
                "description": "A recurrent, severe headache that can be accompanied by other symptoms",
                "symptoms": ["Headache", "Nausea", "Dizziness"]
            },
            {
                "name": "COVID-19",
                "description": "An infectious disease caused by the SARS-CoV-2 virus",
                "symptoms": ["Fever", "Cough", "Fatigue", "Shortness of Breath", "Sore Throat"]
            },
            {
                "name": "Gastroenteritis",
                "description": "Inflammation of the stomach and intestines",
                "symptoms": ["Nausea", "Fatigue", "Fever"]
            }
        ]
        
        for data in diseases_data:
            disease, created = Disease.objects.get_or_create(
                name=data["name"],
                defaults={"description": data["description"]}
            )
            
            # Add symptoms to the disease
            for symptom_name in data["symptoms"]:
                try:
                    symptom = Symptom.objects.get(name=symptom_name)
                    disease.symptoms.add(symptom)
                except Symptom.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'Symptom {symptom_name} not found'))
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created disease: {disease.name}'))
        
        # Create doctors
        doctors_data = [
            {
                "name": "John Smith",
                "specialization": "general",
                "hospital": "Central Hospital",
                "contact": "123-456-7890",
                "email": "john.smith@hospital.com",
                "is_available_for_emergency": True
            },
            {
                "name": "Sarah Johnson",
                "specialization": "cardiology",
                "hospital": "Heart Medical Center",
                "contact": "234-567-8901",
                "email": "sarah.johnson@hospital.com",
                "is_available_for_emergency": True
            },
            {
                "name": "Michael Brown",
                "specialization": "neurology",
                "hospital": "Neuroscience Institute",
                "contact": "345-678-9012",
                "email": "michael.brown@hospital.com",
                "is_available_for_emergency": False
            },
            {
                "name": "Emily Davis",
                "specialization": "pediatrics",
                "hospital": "Children's Hospital",
                "contact": "456-789-0123",
                "email": "emily.davis@hospital.com",
                "is_available_for_emergency": True
            }
        ]
        
        for data in doctors_data:
            doctor, created = Doctor.objects.get_or_create(
                name=data["name"],
                defaults={
                    "specialization": data["specialization"],
                    "hospital": data["hospital"],
                    "contact": data["contact"],
                    "email": data["email"],
                    "is_available_for_emergency": data["is_available_for_emergency"]
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created doctor: Dr. {doctor.name}'))
        
        self.stdout.write(self.style.SUCCESS('Data load completed successfully'))