from rest_framework import serializers
from .models import Medication, MedicationLog

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'name', 'dosage', 'frequency', 'start_date', 'end_date', 'instructions']
        
    def create(self, validated_data):
        user = self.context['request'].user
        medication = Medication.objects.create(user=user, **validated_data)
        return medication

class MedicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationLog
        fields = ['id', 'medication', 'taken_at', 'taken', 'notes']
        
    def validate_medication(self, value):
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only log your own medications.")
        return value