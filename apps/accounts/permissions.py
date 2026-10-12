from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Permission allowing users to edit only their own object."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(obj, 'user') and obj.user == request.user or obj == request.user


class IsGuestOnly(permissions.BasePermission):
    """Permission allowing access only to unauthenticated users."""

    def has_permission(self, request, view):
        return not request.user.is_authenticated
