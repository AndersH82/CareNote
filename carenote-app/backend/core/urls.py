from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BrukareKalenderViewSet, BrukareViewSet, AnteckningViewSet, AvvikelseViewSet, 
    LakemedelViewSet, MedicinSigneringViewSet,
    ArbetspassViewSet, VikariePassViewSet, BrukareAktivitetViewSet,
    ChattMeddelandeViewSet, OverlamningViewSet, BrukareRutinViewSet, min_profil, statistik_oversikt, 
)

router = DefaultRouter()
router.register(r'brukare', BrukareViewSet)
router.register(r'anteckningar', AnteckningViewSet)
router.register(r'avvikelser', AvvikelseViewSet)
router.register(r'lakemedel', LakemedelViewSet)
router.register(r'medicin-signeringar', MedicinSigneringViewSet)
router.register(r'arbetspass', ArbetspassViewSet)
router.register(r'vikariepass', VikariePassViewSet)
router.register(r'brukare-aktiviteter', BrukareAktivitetViewSet)
router.register(r'chatt', ChattMeddelandeViewSet)
router.register(r'overlamningar', OverlamningViewSet)
router.register(r'brukare-rutiner', BrukareRutinViewSet)
router.register(r'brukare-kalender', BrukareKalenderViewSet)

urlpatterns = [
    path('min-profil/', min_profil, name='min-profil'),
    path('statistik/', statistik_oversikt, name='statistik-oversikt'), # Vår nya statistik-endpoint
    path('', include(router.urls)),
]