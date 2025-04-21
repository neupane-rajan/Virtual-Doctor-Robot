class SymptomAnalyzer:
    @staticmethod
    def analyze(symptom_log):
        """
        A simple rule-based system for analyzing symptoms
        This is a mock implementation - in a real system, this would be more sophisticated
        """
        from .models import Disease, Diagnosis
        
        # Get all symptoms from the log
        symptoms = symptom_log.symptoms.all()
        symptom_ids = [s.id for s in symptoms]
        
        # Find diseases that match at least one symptom
        matching_diseases = Disease.objects.filter(symptoms__in=symptom_ids).distinct()
        
        # Calculate match percentage for each disease
        disease_matches = []
        for disease in matching_diseases:
            disease_symptoms = disease.symptoms.all()
            common_symptoms = [s for s in symptoms if s in disease_symptoms]
            match_percentage = len(common_symptoms) / len(disease_symptoms) * 100
            
            if match_percentage >= 50:  # Only include if 50% or more symptoms match
                disease_matches.append((disease, match_percentage))
        
        # Sort by match percentage (highest first)
        disease_matches.sort(key=lambda x: x[1], reverse=True)
        
        # Create recommendations based on matching diseases
        if not disease_matches:
            recommendation = "No specific conditions matched your symptoms. Consider consulting a healthcare provider for personalized advice."
            possible_diseases = []
        else:
            possible_diseases = [d[0] for d in disease_matches]
            
            # Generate recommendation text
            if disease_matches[0][1] > 80:
                recommendation = f"Your symptoms strongly suggest {disease_matches[0][0].name}. Please consult a healthcare provider."
            else:
                recommendation = "Based on your symptoms, you might be experiencing one of the following conditions. Please consult a healthcare provider for accurate diagnosis."
        
        # Create diagnosis
        diagnosis = Diagnosis.objects.create(
            symptom_log=symptom_log,
            recommendation=recommendation
        )
        
        if possible_diseases:
            diagnosis.possible_diseases.set(possible_diseases)
        
        return diagnosis