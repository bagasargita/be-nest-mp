import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Menu } from '../../../menu/entities/menu.entity';

export default class MenuSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const menuRepository = dataSource.getRepository(Menu);

    // Check if menus already exist
    const existingMenus = await menuRepository.find();
    if (existingMenus.length > 0) {
      console.log('Menus already seeded');
      return;
    }

    // Define menu data based on the INSERT statements provided
    const menus = [
      // Dashboard
      {
        id: '40efc515-2f9f-4c6a-84aa-70835597f353',
        name: 'Dashboard',
        description: null,
        path: '/dashboard',
        icon: 'DashboardOutlined',
        parentId: null,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date('2025-07-02 09:37:30.842'),
        updatedAt: new Date('2025-07-02 09:37:30.842'),
        createdBy: null,
        updatedBy: null,
      },
      
      // Account
      {
        id: '407ba4bf-c19f-47fc-a390-b14318231c1c',
        name: 'Account',
        description: null,
        path: '/account',
        icon: 'ShopOutlined',
        parentId: null,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date('2025-07-02 09:51:23.316448'),
        updatedAt: new Date('2025-07-02 09:51:23.316448'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Master (Parent)
      {
        id: 'bde34e49-879c-4b59-ad41-1918c7ea3699',
        name: 'Master',
        description: null,
        path: '/master',
        icon: 'AppstoreFilled',
        parentId: null,
        displayOrder: 70,
        isActive: true,
        createdAt: new Date('2025-07-22 08:37:26.240249'),
        updatedAt: new Date('2025-07-22 08:37:26.240249'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Services (under Master)
      {
        id: 'b52387c7-99dc-45d3-89c6-3ed43bd12dbb',
        name: 'Services',
        description: 'Master Services',
        path: '/master/services',
        icon: 'AppstoreAddOutlined',
        parentId: 'bde34e49-879c-4b59-ad41-1918c7ea3699',
        displayOrder: 71,
        isActive: true,
        createdAt: new Date('2025-07-02 09:57:50.872889'),
        updatedAt: new Date('2025-07-22 09:55:23.911714'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
      },

      // Postal Code (under Master)
      {
        id: '1685ee57-eb34-4e21-8038-a821339ae9a7',
        name: 'Postal Code',
        description: 'Postal Code',
        path: '/master/postal-code',
        icon: 'DeliveredProcedureOutlined',
        parentId: 'bde34e49-879c-4b59-ad41-1918c7ea3699',
        displayOrder: 72,
        isActive: true,
        createdAt: new Date('2025-08-08 14:04:15.178645'),
        updatedAt: new Date('2025-08-08 14:04:15.178645'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // CDM Provider (under Master)
      {
        id: '8991df5a-2c55-410e-be22-488a46acd437',
        name: 'CDM Provider',
        description: 'Master CDM Provider',
        path: '/master/cdm-providers',
        icon: 'ApartmentOutlined',
        parentId: 'bde34e49-879c-4b59-ad41-1918c7ea3699',
        displayOrder: 79,
        isActive: true,
        createdAt: new Date('2025-07-22 08:38:36.855017'),
        updatedAt: new Date('2025-08-08 14:04:32.391748'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
      },

      // Parameter (Parent)
      {
        id: 'e365de64-d599-483d-9abd-199ca6e152c6',
        name: 'Parameter',
        description: null,
        path: '/parameter',
        icon: 'BookTwoTone',
        parentId: null,
        displayOrder: 80,
        isActive: true,
        createdAt: new Date('2025-07-02 09:52:38.161954'),
        updatedAt: new Date('2025-07-22 08:37:37.936208'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
      },

      // Industry (under Parameter)
      {
        id: 'b84963b8-2d11-4739-ad19-44c6848625ed',
        name: 'Industry',
        description: null,
        path: '/parameter/industry',
        icon: 'BuildOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date('2025-07-02 09:53:13.891593'),
        updatedAt: new Date('2025-07-02 09:53:13.891593'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Business Type (under Parameter)
      {
        id: 'dacf7424-715a-41c6-a629-7ea469c8836e',
        name: 'Business Type',
        description: null,
        path: '/parameter/business-type',
        icon: 'AppstoreOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 2,
        isActive: true,
        createdAt: new Date('2025-07-02 09:53:56.86858'),
        updatedAt: new Date('2025-07-02 09:53:56.86858'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Bank (under Parameter)
      {
        id: 'd7134aa7-b6a4-4db7-a113-b80f033912eb',
        name: 'Bank',
        description: null,
        path: '/parameter/bank',
        icon: 'BankFilled',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 3,
        isActive: true,
        createdAt: new Date('2025-07-02 09:54:14.164781'),
        updatedAt: new Date('2025-07-02 09:54:14.164781'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Bank Category (under Parameter)
      {
        id: '60d1acd0-5bbf-45b1-9e65-48af01139726',
        name: 'Bank Category',
        description: null,
        path: '/parameter/bank-category',
        icon: 'BankOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 4,
        isActive: true,
        createdAt: new Date('2025-07-02 09:54:42.370995'),
        updatedAt: new Date('2025-07-02 09:54:42.370995'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Position (under Parameter)
      {
        id: '238490d1-7992-4d72-9f7e-99ead08e18fe',
        name: 'Position',
        description: null,
        path: '/parameter/position',
        icon: 'UserSwitchOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 5,
        isActive: true,
        createdAt: new Date('2025-07-02 09:55:13.802108'),
        updatedAt: new Date('2025-07-02 09:55:13.802108'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Account Type (under Parameter)
      {
        id: '3c4622e5-3903-44e2-902d-755371e44d04',
        name: 'Account Type',
        description: null,
        path: '/parameter/account-type',
        icon: 'ContainerOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 6,
        isActive: true,
        createdAt: new Date('2025-07-02 09:56:08.857457'),
        updatedAt: new Date('2025-07-02 09:56:08.857457'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Account Category (under Parameter)
      {
        id: 'c16125d2-6472-42fd-b183-cc82a643d21b',
        name: 'Account Category',
        description: null,
        path: '/parameter/account-category',
        icon: 'DiffOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 7,
        isActive: true,
        createdAt: new Date('2025-07-02 09:57:02.91024'),
        updatedAt: new Date('2025-07-02 09:57:17.571558'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
      },

      // Document Type (under Parameter)
      {
        id: '1135617d-9ece-4d5b-893d-8608966c135f',
        name: 'Document Type',
        description: null,
        path: '/parameter/document-type',
        icon: 'DatabaseOutlined',
        parentId: 'e365de64-d599-483d-9abd-199ca6e152c6',
        displayOrder: 9,
        isActive: true,
        createdAt: new Date('2025-07-02 09:59:11.316663'),
        updatedAt: new Date('2025-07-02 09:59:11.316663'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },

      // Settings (Parent)
      {
        id: '394712cc-03d6-4fa9-8fc3-3a65c1d11c08',
        name: 'Settings',
        description: null,
        path: '/settings',
        icon: 'SettingOutlined',
        parentId: null,
        displayOrder: 90,
        isActive: true,
        createdAt: new Date('2025-07-02 09:37:30.843'),
        updatedAt: new Date('2025-07-22 08:37:43.048438'),
        createdBy: null,
        updatedBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
      },

      // User Management (under Settings)
      {
        id: 'c6715bb9-0e7a-4e18-a1c2-f57b51b1d101',
        name: 'User Management',
        description: null,
        path: '/users',
        icon: 'UserOutlined',
        parentId: '394712cc-03d6-4fa9-8fc3-3a65c1d11c08',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date('2025-07-02 09:37:30.843'),
        updatedAt: new Date('2025-07-02 09:37:30.843'),
        createdBy: null,
        updatedBy: null,
      },

      // Role Management (under Settings)
      {
        id: '2e9b9378-dae5-4330-adaf-4d56e53c0a9c',
        name: 'Role Management',
        description: null,
        path: '/roles',
        icon: 'TeamOutlined',
        parentId: '394712cc-03d6-4fa9-8fc3-3a65c1d11c08',
        displayOrder: 2,
        isActive: true,
        createdAt: new Date('2025-07-02 09:37:30.843'),
        updatedAt: new Date('2025-07-02 09:37:30.843'),
        createdBy: null,
        updatedBy: null,
      },

      // Menu Management (under Settings)
      {
        id: '6b693b1b-4120-4b96-9763-0cdf0fad217f',
        name: 'Menu Management',
        description: null,
        path: '/menus',
        icon: 'MenuOutlined',
        parentId: '394712cc-03d6-4fa9-8fc3-3a65c1d11c08',
        displayOrder: 3,
        isActive: true,
        createdAt: new Date('2025-07-02 09:37:30.844'),
        updatedAt: new Date('2025-07-02 09:37:30.844'),
        createdBy: null,
        updatedBy: null,
      },

      // Profile
      {
        id: '68213bb6-43ae-42a7-a8f4-56fbcea8c5aa',
        name: 'Profile',
        description: null,
        path: '/profile',
        icon: 'ProfileFilled',
        parentId: null,
        displayOrder: 100,
        isActive: true,
        createdAt: new Date('2025-07-02 10:06:44.826989'),
        updatedAt: new Date('2025-07-02 10:06:44.826989'),
        createdBy: '312ecaea-496b-40ed-804e-b1c984b16c45',
        updatedBy: null,
      },
    ];

    // Insert menus in order (parent menus first, then child menus)
    await menuRepository.insert(menus);
    console.log(`Menu seed completed successfully - ${menus.length} menus inserted`);
  }
}