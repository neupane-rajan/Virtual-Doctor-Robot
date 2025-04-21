from rest_framework import serializers
from .models import Doctor, Appointment

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'hospital', 'contact', 'email', 'is_available_for_emergency']

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.name')
    
    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'doctor_name', 'date', 'time', 'reason', 
                 'is_emergency', 'status', 'notes', 'created_at']
        read_only_fields = ['status', 'created_at']
        
    def create(self, validated_data):
        user = self.context['request'].user
        appointment = Appointment.objects.create(user=user, **validated_data)
        return appointment