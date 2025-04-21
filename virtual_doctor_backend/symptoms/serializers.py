from rest_framework import serializers
from .models import Symptom, Disease, SymptomLog, Diagnosis

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name', 'description']

class DiseaseSerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)
    
    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'symptoms']

class SymptomLogSerializer(serializers.ModelSerializer):
    symptoms = serializers.PrimaryKeyRelatedField(many=True, queryset=Symptom.objects.all())
    
    class Meta:
        model = SymptomLog
        fields = ['id', 'symptoms', 'description', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        symptoms_data = validated_data.pop('symptoms')
        user = self.context['request'].user
        symptom_log = SymptomLog.objects.create(user=user, **validated_data)
        symptom_log.symptoms.set(symptoms_data)
        return symptom_log

class DiagnosisSerializer(serializers.ModelSerializer):
    possible_diseases = DiseaseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Diagnosis
        fields = ['id', 'symptom_log', 'possible_diseases', 'recommendation', 'created_at']
        read_only_fields = ['created_at']