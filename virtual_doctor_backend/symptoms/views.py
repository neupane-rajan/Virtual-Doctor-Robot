from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Symptom, Disease, SymptomLog, Diagnosis
from .serializers import SymptomSerializer, DiseaseSerializer, SymptomLogSerializer, DiagnosisSerializer
from .services import SymptomAnalyzer

class SymptomListView(generics.ListAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer
    permission_classes = [permissions.IsAuthenticated]

class SymptomLogCreateView(generics.CreateAPIView):
    serializer_class = SymptomLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        symptom_log = serializer.save()
        # Automatically analyze symptoms and create diagnosis
        SymptomAnalyzer.analyze(symptom_log)

class SymptomHistoryView(generics.ListAPIView):
    serializer_class = SymptomLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SymptomLog.objects.filter(user=self.request.user).order_by('-created_at')

class DiagnosisDetailView(generics.RetrieveAPIView):
    serializer_class = DiagnosisSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Diagnosis.objects.filter(symptom_log__user=self.request.user)