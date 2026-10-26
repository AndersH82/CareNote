from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import (
    Brukare, Anteckning, AvvikelseRapport, BrukareRutin, Lakemedel, MedicinSignering, 
    Arbetspass, VikariePass, BrukareAktivitet, ChattMeddelande, Overlamning,
    AnvandarProfil, BrukareKalenderHändelse
)
from .serializers import (
    BrukareSerializer, AnteckningSerializer, AvvikelseRapportSerializer, 
    LakemedelSerializer, MedicinSigneringSerializer, ArbetspassSerializer, VikariePassSerializer, BrukareAktivitetSerializer, ChattMeddelandeSerializer, OverlamningSerializer, BrukareRutinSerializer, BrukareKalenderHändelseSerializer
)

class BrukareViewSet(viewsets.ModelViewSet):
    queryset = Brukare.objects.all()
    serializer_class = BrukareSerializer

class BrukareRutinViewSet(viewsets.ModelViewSet):
    queryset = BrukareRutin.objects.all()
    serializer_class = BrukareRutinSerializer

class BrukareKalenderViewSet(viewsets.ModelViewSet):
    queryset = BrukareKalenderHändelse.objects.all()
    serializer_class = BrukareKalenderHändelseSerializer

class AnteckningViewSet(viewsets.ModelViewSet):
    queryset = Anteckning.objects.all().order_by('-skapad_datum')
    serializer_class = AnteckningSerializer

class AvvikelseViewSet(viewsets.ModelViewSet):
    queryset = AvvikelseRapport.objects.all().order_by('-skapad_datum')
    serializer_class = AvvikelseRapportSerializer

class LakemedelViewSet(viewsets.ModelViewSet):
    queryset = Lakemedel.objects.all()
    serializer_class = LakemedelSerializer

class MedicinSigneringViewSet(viewsets.ModelViewSet):
    queryset = MedicinSignering.objects.all().order_by('-signerad_tid')
    serializer_class = MedicinSigneringSerializer

class ArbetspassViewSet(viewsets.ModelViewSet):
    queryset = Arbetspass.objects.all().order_by('datum', 'start_tid')
    serializer_class = ArbetspassSerializer

class VikariePassViewSet(viewsets.ModelViewSet):
    queryset = VikariePass.objects.all()
    serializer_class = VikariePassSerializer

class BrukareAktivitetViewSet(viewsets.ModelViewSet):
    queryset = BrukareAktivitet.objects.all().order_by('datum', 'tid')
    serializer_class = BrukareAktivitetSerializer

class ChattMeddelandeViewSet(viewsets.ModelViewSet):
    queryset = ChattMeddelande.objects.all().order_by('-skapad_datum')
    serializer_class = ChattMeddelandeSerializer

class OverlamningViewSet(viewsets.ModelViewSet):
    queryset = Overlamning.objects.all().order_by('-skapad_tid')
    serializer_class = OverlamningSerializer

# Api-endpoint för statistiköversikt

@api_view(['GET'])
def statistik_oversikt(view, format=None):
    antal_brukare = Brukare.objects.count()
    antal_avvikelser = AvvikelseRapport.objects.count()
    antal_signeringar = MedicinSignering.objects.count()
    antal_pass = Arbetspass.objects.count()
    
    # Räkna allvarliga avvikelser
    hog_avvikelse = AvvikelseRapport.objects.filter(allvarlighetsgrad='hog').count()

    data = {
        "antal_brukare": antal_brukare,
        "antal_avvikelser": antal_avvikelser,
        "hog_avvikelse": hog_avvikelse,
        "antal_signeringar": antal_signeringar,
        "antal_pass": antal_pass,
    }
    return Response(data)

# Api-endpoint för att hämta användarprofil

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def min_profil(request):
    user = request.user
    # Hämta eller skapa en profil om den mot förmodan saknas
    profil, created = AnvandarProfil.objects.get_or_create(user=user)
    return Response({
        "username": user.username,
        "roll": profil.roll,  # Returnerar den faktiska rollen från databasen
        "is_staff": user.is_staff
    })