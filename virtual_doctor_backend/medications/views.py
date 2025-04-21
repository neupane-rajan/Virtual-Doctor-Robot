from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Medication, MedicationLog
from .serializers import MedicationSerializer, MedicationLogSerializer

class MedicationListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)

class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)

class MedicationLogListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicationLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MedicationLog.objects.filter(medication__user=self.request.user)