import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('You do not have sufficient permissions');
    }
    
    // Special case: superadmin user or role always has all permissions
    const isSuperAdminByUsername = user.username && user.username.toLowerCase() === 'superadmin';
    
    // Check if user has a superadmin role
    const isSuperAdminByRole = user.roles?.some(
      role => role.name.toLowerCase() === 'superadmin' && role.isActive
    );
    
    if (isSuperAdminByUsername || isSuperAdminByRole) {
      return true;
    }
    
    // For regular users, check specific permissions
    if (!user.permissions || !Array.isArray(user.permissions)) {
      console.error(`User ${user.username} has no permissions array`);
      throw new ForbiddenException('You do not have sufficient permissions');
    }

    const hasPermission = requiredPermissions.some(permission => {
      try {
        const found = user.permissions.some(p => p.code === permission);
        return found;
      } catch (error) {
        console.error(`Error checking permission ${permission}:`, error);
        return false;
      }
    });
    
    if (!hasPermission) {
      throw new ForbiddenException('You do not have sufficient permissions');
    }
    
    return true;
  }
}