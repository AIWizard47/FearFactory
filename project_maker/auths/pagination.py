from rest_framework.pagination import CursorPagination

class UserCursorPagination(CursorPagination):
    ordering = '-date_joined'
    page_size = 10

class FriendRequestCursorPagination(CursorPagination):
    ordering = '-created_at'
    page_size = 10

class UserSearchCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-id'      # Fast ordering (indexed)
