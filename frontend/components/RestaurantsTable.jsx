import React from "react"
import { Table, Button } from "web3uikit"
import Link from "next/link"

export const RestaurantsTable = ({
    data,
    columnsConfig,
    header,
    showStatus,
    onToggleStatus,
    buttonLoading,
}) => {
    return (
        <Table
            columnsConfig={columnsConfig}
            data={data.map((restaurant) => [
                <Link
                    className="text-green-600 hover:text-blue-500  cursor-pointer rounded-sm"
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.restaurantId}`}
                >
                    {restaurant.name}
                </Link>,
                <div>{restaurant.businessAddress}</div>,
                ...(showStatus
                    ? [
                          <div>{restaurant.isActive ? "Active" : "Inactive"}</div>,
                          <Button
                              onClick={() => onToggleStatus(restaurant)}
                              theme="primary"
                              text={
                                  buttonLoading ? (
                                      <Loading
                                          size={20}
                                          spinnerColor="#ffffff"
                                          spinnerType="wave"
                                      />
                                  ) : restaurant.isActive ? (
                                      "Deactivate"
                                  ) : (
                                      "Activate"
                                  )
                              }
                          />,
                      ]
                    : []),
            ])}
            header={header}
            isColumnSortable={[true, false, false]}
            maxPages={10}
            onPageNumberChanged={function noRefCheck() {}}
            onRowClick={function noRefCheck() {}}
            pageSize={5}
        />
    )
}
