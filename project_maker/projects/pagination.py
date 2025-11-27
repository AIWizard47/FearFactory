from rest_framework.pagination import CursorPagination

class ProjectCursorPagination(CursorPagination):
    page_size = 6                    # items per request
    ordering = "id"                  # newest first
    # cursor_query_param = "cursor"     # ?cursor=xxxx
