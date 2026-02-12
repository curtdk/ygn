import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Input, Select } from "@medusajs/ui"
import { useState, useEffect } from "react"

const VideoMaterialsWidget = ({ data }: { data: any }) => {
  const [materials, setMaterials] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    material_key: "",
    material_type: "image",
    default_url: "",
    is_replaceable: true,
    sort_order: 0
  })

  const productId = data?.id

  useEffect(() => {
    if (productId) {
      fetchMaterials()
    }
  }, [productId])

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`/admin/video-materials?product_id=${productId}`, {
        credentials: "include"
      })
      const data = await response.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error("Failed to fetch materials:", error)
    }
  }

  const handleAddMaterial = async () => {
    try {
      await fetch("/admin/video-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newMaterial,
          product_id: productId
        })
      })
      setIsAdding(false)
      setNewMaterial({
        name: "",
        material_key: "",
        material_type: "image",
        default_url: "",
        is_replaceable: true,
        sort_order: 0
      })
      fetchMaterials()
    } catch (error) {
      console.error("Failed to add material:", error)
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("确定要删除这个素材吗？")) return

    try {
      await fetch(`/admin/video-materials/${materialId}`, {
        method: "DELETE",
        credentials: "include"
      })
      fetchMaterials()
    } catch (error) {
      console.error("Failed to delete material:", error)
    }
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">视频可替换素材</Heading>
        <Button onClick={() => setIsAdding(true)}>添加素材</Button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="素材名称（如：角色1）"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
            />
            <Input
              placeholder="素材标识（如：character_1）"
              value={newMaterial.material_key}
              onChange={(e) => setNewMaterial({ ...newMaterial, material_key: e.target.value })}
            />
            <Select
              value={newMaterial.material_type}
              onValueChange={(value) => setNewMaterial({ ...newMaterial, material_type: value })}
            >
              <option value="image">图片</option>
              <option value="audio">声音</option>
              <option value="background">背景</option>
              <option value="video">视频</option>
            </Select>
            <Input
              placeholder="默认素材URL"
              value={newMaterial.default_url}
              onChange={(e) => setNewMaterial({ ...newMaterial, default_url: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMaterial}>保存</Button>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>取消</Button>
          </div>
        </div>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名称</Table.HeaderCell>
            <Table.HeaderCell>标识Key</Table.HeaderCell>
            <Table.HeaderCell>类型</Table.HeaderCell>
            <Table.HeaderCell>默认素材</Table.HeaderCell>
            <Table.HeaderCell>可替换</Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {materials.map((material: any) => (
            <Table.Row key={material.id}>
              <Table.Cell>{material.name}</Table.Cell>
              <Table.Cell>{material.material_key}</Table.Cell>
              <Table.Cell>{material.material_type}</Table.Cell>
              <Table.Cell className="max-w-xs truncate">{material.default_url}</Table.Cell>
              <Table.Cell>{material.is_replaceable ? "是" : "否"}</Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  删除
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {materials.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          暂无素材，点击"添加素材"开始配置
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default VideoMaterialsWidget
