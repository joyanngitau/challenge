from rest_framework import serializers
from django.contrib.auth import get_user_model

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"})
    eth_wallet = serializers.CharField(required=False, allow_blank=True, max_length=42)  # Add eth_wallet field

    class Meta:
        model = get_user_model()
        fields = ("first_name", "last_name", "email", "password", "password2", "eth_wallet")
        extra_kwargs = {
            "password": {"write_only": True},
            "password2": {"write_only": True}
        }

    def save(self):
        user = get_user_model()(
            email=self.validated_data["email"],
            first_name=self.validated_data["first_name"],
            last_name=self.validated_data["last_name"],
            eth_wallet=self.validated_data.get("eth_wallet", "")  # Add wallet address
        )

        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError(
                {"password": "Passwords do not match!"})

        user.set_password(password)
        user.save()

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    eth_wallet = serializers.CharField(max_length=42, read_only=True)  # Ensure eth_wallet is included

    class Meta:
        model = get_user_model()
        fields = ("id", "email", "is_staff", "first_name", "last_name", "eth_wallet")  # Include eth_wallet
