from rest_framework import serializers
from .models import Brukare, Anteckning, AvvikelseRapport, Lakemedel, MedicinSignering, Arbetspass, VikariePass, BrukareAktivitet, ChattMeddelande, Overlamning, BrukareRutin, BrukareKalenderHändelse

class BrukareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brukare
        fields = '__all__'

class BrukareRutinSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrukareRutin
        fields = '__all__'        

class BrukareKalenderHändelseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrukareKalenderHändelse
        fields = '__all__'

class AnteckningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anteckning
        fields = '__all__'
        extra_kwargs = {'personal_namn': {'required': False, 'allow_blank': True}}

class AvvikelseRapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvvikelseRapport
        fields = '__all__'
        extra_kwargs = {'personal_namn': {'required': False, 'allow_blank': True}}

class LakemedelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lakemedel
        fields = '__all__'

class MedicinSigneringSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicinSignering
        fields = '__all__'

class ArbetspassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arbetspass
        fields = '__all__'

class VikariePassSerializer(serializers.ModelSerializer):
    class Meta:
        model = VikariePass
        fields = '__all__'

class BrukareAktivitetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrukareAktivitet
        fields = '__all__'

class ChattMeddelandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChattMeddelande
        fields = '__all__'

class OverlamningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Overlamning
        fields = '__all__'